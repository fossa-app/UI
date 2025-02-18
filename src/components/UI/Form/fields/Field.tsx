import * as React from 'react';
import { FieldProps, FieldType } from '../form.model';
import InputField from './InputField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import SectionField from './SectionField';
import LabelValueField from './LabelValueField';

const Field = <T,>(props: FieldProps<T>) => {
  switch (props.type) {
    case FieldType.text:
      return <InputField {...props} />;
    case FieldType.select:
      return <SelectField {...props} />;
    case FieldType.checkbox:
      return <CheckboxField {...props} />;
    case FieldType.section:
      return <SectionField {...props} />;
    case FieldType.labelValue:
      return <LabelValueField {...props} />;
    default:
      throw new Error('Invalid Field Type');
  }
};

export default Field;
