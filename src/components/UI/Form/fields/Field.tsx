import * as React from 'react';
import { FormFieldProps, FormFieldType } from '../form.model';
import InputField from './InputField';
import AutocompleteField from './AutocompleteField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import SectionField from './SectionField';
import LabelValueField from './LabelValueField';
import SwitchField from './SwitchField';
import FileUploadField from './FileUploadField';

const Field = <T,>(props: FormFieldProps<T>) => {
  switch (props.type) {
    case FormFieldType.text:
      return <InputField {...props} />;
    case FormFieldType.autocomplete:
      return <AutocompleteField {...props} />;
    case FormFieldType.select:
      return <SelectField {...props} />;
    case FormFieldType.checkbox:
      return <CheckboxField {...props} />;
    case FormFieldType.switch:
      return <SwitchField {...props} />;
    case FormFieldType.section:
      return <SectionField {...props} />;
    case FormFieldType.labelValue:
      return <LabelValueField {...props} />;
    case FormFieldType.fileUpload:
      return <FileUploadField {...props} />;
    default:
      throw new Error('Invalid Form Field Type');
  }
};

export default Field;
