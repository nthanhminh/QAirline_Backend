import { ETimeZone } from "src/common/enum/index.enum";
import * as momentTz from 'moment-timezone'
export function durationToSeconds(duration: string): number {
    const regex = /^(\d{2}):(\d{2}):(\d{2})$/;
    const match = duration.match(regex);
  
    if (!match) {
      throw new Error('Invalid duration format. Expected HH:mm:ss');
    }
  
    const [_, hours, minutes, seconds] = match;

    const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  
    return totalSeconds;
}

export function convertNowToTimezone(timezone: ETimeZone) {
  return momentTz.tz(timezone);
}
  
  