import * as React from 'react';
import { ViewItemProps, ViewItemType } from '../view-details.model';
import TextItem from './TextItem';
import SectionItem from './SectionItem';

const Item = <T,>({ values, ...props }: { values: T } & ViewItemProps<T>) => {
  switch (props.type) {
    case ViewItemType.text:
      return <TextItem values={values} {...props} />;
    case ViewItemType.section:
      return <SectionItem {...props} />;
    default:
      throw new Error('Invalid View Item Type');
  }
};

export default Item;
