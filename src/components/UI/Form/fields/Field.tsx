import * as React from 'react';
import { FieldProps, FieldType } from '../form.model';
import InputField from './InputField';
import SelectField from './SelectField';

const Field: React.FC<FieldProps> = (props) => {
  switch (props.type) {
    case FieldType.text:
      return <InputField {...props} />;
    case FieldType.select:
      return <SelectField {...props} />;
    default:
      throw new Error('Invalid Field Type');
  }
};

export default Field;
