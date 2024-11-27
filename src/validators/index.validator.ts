import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsDateTimeDDMMYYYYHHMMSS(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDateTimeDDMMYYYYHHMMSS',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Kiểm tra định dạng dd-MM-yyyy HH:mm:ss
          const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4} \d{2}:\d{2}:\d{2}$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format dd-MM-yyyy HH:mm:ss`;
        }
      }
    });
  };
}


export function IsDateTimeDDMMYYYY(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDateTimeDDMMYYYY',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Regex for dd-MM-yyyy
          const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

          if (typeof value !== 'string' || !regex.test(value)) {
            return false;
          }

          // Validate if the date is valid (e.g., not 31-02-2024)
          const [day, month, year] = value.split('-').map(Number);
          const date = new Date(year, month - 1, day); // Month is zero-based in JS Dates
          return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format dd-MM-yyyy`;
        },
      },
    });
  };
}

export function IsTimeFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'IsTimeFormat',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            // Regex chỉ kiểm tra định dạng HH:mm:ss
            const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
            if (typeof value !== 'string') {
              return false;
            }
            return timeRegex.test(value);
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be in the format HH:mm:ss`;
          },
        },
      });
    };
  }
  
