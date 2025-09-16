import React from 'react';
import { ViewDetailFieldProps, ViewDetailType } from '../view-details.model';
import LabelValueDetail from './LabelValueDetail';
import SectionDetail from './SectionDetail';

const Detail = <T,>({ values, ...props }: { values: T } & ViewDetailFieldProps<T>) => {
  switch (props.type) {
    case ViewDetailType.labelValue:
      return <LabelValueDetail values={values} {...props} />;
    case ViewDetailType.section:
      return <SectionDetail {...props} />;
    default:
      throw new Error('Invalid View Detail Type');
  }
};

export default Detail;
