function durationToSeconds(duration: string): number {
    // Regular expression to match the HH:mm:ss format
    const regex = /^(\d{2}):(\d{2}):(\d{2})$/;
    const match = duration.match(regex);
  
    if (!match) {
      throw new Error('Invalid duration format. Expected HH:mm:ss');
    }
  
    // Extract hours, minutes, and seconds from the matched regex groups
    const [_, hours, minutes, seconds] = match;
  
    // Convert to number and calculate total seconds
    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  
    return totalSeconds;
}
  
  