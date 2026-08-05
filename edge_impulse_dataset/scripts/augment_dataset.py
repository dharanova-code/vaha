import os
import random
import glob
import numpy as np
import librosa
import soundfile as sf
import audiomentations

# Set random seeds for reproducibility
random.seed(42)
np.random.seed(42)

# Pre-initialize transforms that are easier to run via audiomentations
reverb_transform = audiomentations.RoomSimulator(
    min_size_x=2.0, max_size_x=6.0,
    min_size_y=2.0, max_size_y=6.0,
    min_size_z=2.0, max_size_z=4.0,
    calculation_mode="absorption",
    min_absorption_value=0.2, max_absorption_value=0.5,
    use_ray_tracing=False,
    p=1.0
)

eq_transform = audiomentations.SevenBandParametricEQ(
    min_gain_db=-2.0, max_gain_db=2.0, p=1.0
)

def change_speed(samples, sr, rate):
    """Changes speed of audio (altering both duration and pitch)."""
    return librosa.resample(samples, orig_sr=int(sr * rate), target_sr=sr)

def preprocess_audio(samples, sr, target_max_duration=1.5):
    """
    Validates, trims silence, removes DC offset, normalizes loudness, 
    removes clipping, and crops to a maximum of 1.5 seconds without cutting speech.
    """
    # 1. Remove DC offset
    samples = samples - np.mean(samples)
    
    # 2. Trim silence (threshold 20dB)
    trimmed, _ = librosa.effects.trim(samples, top_db=20)
    
    # 3. Normalize loudness (scale to peak of 0.9 to prevent clipping)
    peak = np.max(np.abs(trimmed))
    if peak > 0:
        trimmed = trimmed / peak * 0.9
        
    # 4. Crop to maximum of 1.5 seconds centered around the peak energy
    duration = len(trimmed) / sr
    if duration > target_max_duration:
        max_idx = np.argmax(np.abs(trimmed))
        half_len = int(target_max_duration * sr / 2)
        start = max(0, max_idx - half_len)
        end = min(len(trimmed), max_idx + half_len)
        
        target_len = int(target_max_duration * sr)
        if end - start < target_len:
            if start == 0:
                end = min(len(trimmed), target_len)
            else:
                start = max(0, len(trimmed) - target_len)
        trimmed = trimmed[start:end]
        
    return trimmed

def main():
    input_dir = os.path.join("raw", "im_done")
    output_dir = os.path.join("generated", "im_done")
    os.makedirs(output_dir, exist_ok=True)

    # Clean up output directory first to ensure clean state
    for f in glob.glob(os.path.join(output_dir, "*.wav")):
        try:
            os.remove(f)
        except Exception:
            pass

    # Search for WAV files recursively
    search_path = os.path.join(input_dir, "**", "*.wav")
    wav_files = glob.glob(search_path, recursive=True)

    if not wav_files:
        print(f"No WAV files found in {input_dir}")
        return

    original_count = len(wav_files)
    generated_count = 0
    skipped_files = []

    # Track how many times each augmentation is applied
    aug_stats = {
        "Gain": 0,
        "Speed": 0,
        "PitchShift": 0,
        "Reverb": 0,
        "Noise": 0,
        "TimeShift": 0,
        "EQ": 0
    }

    # Store durations for statistics
    durations = []

    # We target approximately 1800 total generated samples
    num_augs_per_file = max(1, 1800 // original_count)

    print(f"Found {original_count} original WAV recordings.")
    print(f"Generating approximately {num_augs_per_file} augmentations per recording...")

    # A counter to keep absolute generated filenames unique
    global_gen_id = 1

    for wav_path in wav_files:
        original_filename = os.path.basename(wav_path)
        
        # Load audio, forcing 16 kHz sample rate and mono channel
        try:
            raw_samples, sr = librosa.load(wav_path, sr=16000, mono=True)
            samples = preprocess_audio(raw_samples, sr)
        except Exception as e:
            print(f"Error loading/processing {original_filename}: {e}")
            skipped_files.append(original_filename)
            continue

        print(f"Original: {original_filename}")

        successful_aug_count = 0
        attempts = 0
        
        while successful_aug_count < num_augs_per_file:
            attempts += 1
            if attempts > 1000:
                print(f"Warning: Made 1000 attempts for {original_filename}, stopping at {successful_aug_count} augmentations.")
                break

            y = samples.copy()
            applied_transforms = []

            # 1. Gain ±3 dB
            if random.random() < 0.8:
                gain_db = random.uniform(-3.0, 3.0)
                y = y * (10 ** (gain_db / 20.0))
                applied_transforms.append("Gain")

            # 2. Speed 0.95–1.05
            if random.random() < 0.5:
                speed_factor = random.uniform(0.95, 1.05)
                try:
                    y = change_speed(y, sr, speed_factor)
                    applied_transforms.append("Speed")
                except Exception:
                    pass

            # 3. Pitch Shift ±1 semitone
            if random.random() < 0.5:
                pitch_shift = random.uniform(-1.0, 1.0)
                try:
                    y = librosa.effects.pitch_shift(y, sr=sr, n_steps=pitch_shift)
                    applied_transforms.append("PitchShift")
                except Exception:
                    pass

            # 4. Light Room Reverb
            if random.random() < 0.3:
                try:
                    y = reverb_transform(samples=y, sample_rate=sr)
                    applied_transforms.append("Reverb")
                except Exception:
                    pass

            # 5. Mild Background Noise (Gaussian)
            if random.random() < 0.3:
                noise_amp = random.uniform(0.001, 0.004)
                y = y + noise_amp * np.random.normal(size=len(y))
                applied_transforms.append("Noise")

            # 6. Slight Time Shift
            if random.random() < 0.5:
                shift_samples = int(random.uniform(-0.1, 0.1) * sr)
                y = np.roll(y, shift_samples)
                applied_transforms.append("TimeShift")

            # 7. Tiny EQ variations
            if random.random() < 0.4:
                try:
                    y = eq_transform(samples=y, sample_rate=sr)
                    applied_transforms.append("EQ")
                except Exception:
                    pass

            # --- Validation ---
            duration = len(y) / sr

            # Reject if duration exceeds 2 seconds
            if duration > 2.0:
                continue

            # Reject if speech becomes unintelligible / silent
            rms = np.sqrt(np.mean(y ** 2))
            if rms < 0.003:  # Too quiet
                continue
            
            # Avoid nan/inf
            if not np.isfinite(y).all():
                continue

            # Save the file in strict 16 kHz Mono PCM WAV format
            gen_filename = f"im_done_{global_gen_id:06d}.wav"
            out_path = os.path.join(output_dir, gen_filename)
            try:
                sf.write(out_path, y, sr, subtype='PCM_16')
                print(f"Generated: {gen_filename}")
                
                # Update stats
                for trans in applied_transforms:
                    aug_stats[trans] += 1
                durations.append(duration)
                
                successful_aug_count += 1
                generated_count += 1
                global_gen_id += 1
            except Exception as e:
                print(f"Error saving {gen_filename}: {e}")
                continue

    # Generate Report Statistics
    longest_clip = max(durations) if durations else 0.0
    shortest_clip = min(durations) if durations else 0.0
    avg_duration = sum(durations) / len(durations) if durations else 0.0

    print("\n" + "="*40)
    print("           DATASET AUGMENTATION REPORT")
    print("="*40)
    print(f"Source recordings count:       {original_count}")
    print(f"Generated recordings count:    {generated_count}")
    print(f"Output directory:              {output_dir}")
    print(f"Skipped files:                 {', '.join(skipped_files) if skipped_files else 'None'}")
    print("\nDuration Statistics:")
    print(f"  Longest clip:                {longest_clip:.3f} seconds")
    print(f"  Shortest clip:               {shortest_clip:.3f} seconds")
    print(f"  Average duration:            {avg_duration:.3f} seconds")
    print("\nAugmentation Distribution:")
    for aug, count in aug_stats.items():
        print(f"  {aug:15}: {count} times ({count/max(1, generated_count)*100:.1f}%)")
    print("="*40)

if __name__ == "__main__":
    main()
