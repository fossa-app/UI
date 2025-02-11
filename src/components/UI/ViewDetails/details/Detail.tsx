import * as React from 'react';
import { ViewDetailProps, ViewDetailType } from '../view-details.model';
import LabelValueDetail from './LabelValueDetail';
import SectionDetail from './SectionDetail';

const Detail = <T,>({ values, ...props }: { values: T } & ViewDetailProps<T>) => {
  switch (props.type) {
    case ViewDetailType.labelValue:
      return <LabelValueDetail values={values} {...props} />;
    case ViewDetailType.section:
      return <SectionDetail {...props} />;
    default:
      throw new Error('Invalid View Item Type');
  }
};

export default Detail;
