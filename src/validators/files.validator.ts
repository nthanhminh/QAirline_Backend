import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
  } from 'class-validator';
  import { _checkFileExists } from 'src/helper/filter-file-upload.helper';
  
  // Define both possible domains
  const DOMAIN_1 = 'http://localhost:8000';
  const DOMAIN_2 = 'https://example2.com/';
  
  @ValidatorConstraint({ name: 'isThumbnailPath', async: false })
  export class IsThumbnailPathConstraint implements ValidatorConstraintInterface {
	validate(value: string) {
	  return (
		(value.startsWith(`${DOMAIN_1}\\assets\\uploads\\`) ||
		  value.startsWith(`${DOMAIN_1}/assets/uploads/`) ||
		  value.startsWith(`${DOMAIN_1}\\assets\\defaults\\`) ||
		  value.startsWith(`${DOMAIN_1}/assets/defaults/`) ||
		  value.startsWith(`${DOMAIN_2}\\assets\\uploads\\`) ||
		  value.startsWith(`${DOMAIN_2}/assets/uploads/`) ||
		  value.startsWith(`${DOMAIN_2}\\assets\\defaults\\`) ||
		  value.startsWith(`${DOMAIN_2}/assets/defaults/`))
	  );
	}
  
	defaultMessage() {
	  return 'files.invalid file';
	}
  }
  
  export function IsThumbnailPath(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
	  registerDecorator({
		name: 'isThumbnailPath',
		target: object.constructor,
		propertyName: propertyName,
		options: validationOptions,
		validator: IsThumbnailPathConstraint,
	  });
	};
  }
  
  @ValidatorConstraint({ name: 'isThumbnailExists', async: false })
  export class IsThumbnailExistsConstraint implements ValidatorConstraintInterface {
	validate(value: string) {
	  return _checkFileExists(value);
	}
  
	defaultMessage() {
	  return 'files.the file does not exist';
	}
  }
  
  export function IsThumbnailExists(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
	  registerDecorator({
		name: 'isThumbnailExists',
		target: object.constructor,
		propertyName: propertyName,
		options: validationOptions,
		validator: IsThumbnailExistsConstraint,
	  });
	};
  }
  