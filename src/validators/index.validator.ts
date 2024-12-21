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
          const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4} ([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

          if (typeof value !== 'string' || !regex.test(value)) {
            return false; 
          }

          const [datePart, timePart] = value.split(' ');
          const [day, month, year] = datePart.split('-').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);

          const inputDate = new Date(year, month - 1, day, hours, minutes, seconds);

          if (
            inputDate.getFullYear() !== year ||
            inputDate.getMonth() !== month - 1 ||
            inputDate.getDate() !== day ||
            inputDate.getHours() !== hours ||
            inputDate.getMinutes() !== minutes ||
            inputDate.getSeconds() !== seconds
          ) {
            return false;
          }
          const now = new Date();
          return inputDate > now; 
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format dd-MM-yyyy HH:mm:ss and must be after the current time`;
        },
      },
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
          const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

          if (typeof value !== 'string' || !regex.test(value)) {
            return false;
          }

          const [day, month, year] = value.split('-').map(Number);
          const inputDate = new Date(year, month - 1, day); 

          if (
            inputDate.getFullYear() !== year ||
            inputDate.getMonth() !== month - 1 ||
            inputDate.getDate() !== day
          ) {
            return false;
          }

          const now = new Date();
          now.setHours(0, 0, 0, 0); 
          return inputDate > now; 
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format dd-MM-yyyy and after the current date`;
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

  export function IsDateFormat(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'IsDateFormat',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
            if (typeof value !== 'string') {
              return false;
            }
  
            if (!dateRegex.test(value)) {
              return false;
            }

            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
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

  export function IsStrongPassword(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isStrongPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,14}$/;
                    return typeof value === 'string' && strongPasswordRegex.test(value) && value.trim() !== '';
                },
                defaultMessage(args: ValidationArguments) {
                  return 'Password must be 6-14 characters long, contain at least one uppercase letter, one lowercase letter, one digit, one special character, and must not consist entirely of whitespace.';
                }
            },
        });
    };
}
  
