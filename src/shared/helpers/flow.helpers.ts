import { ICONS } from 'shared/constants';
import { Flow, FlowsMap } from 'shared/models';

export const convertFlowsMapToArray = (flowsMap: FlowsMap): Flow[] => {
  return Object.values(flowsMap).map((flow) => ({
    ...flow,
    icon: flow.icon ? ICONS[flow.icon] : undefined,
    subFlows: flow.subFlows
      ? Object.values(flow.subFlows).map((subFlow) => ({
          ...subFlow,
          icon: subFlow.icon ? ICONS[subFlow.icon] : undefined,
        }))
      : [],
  }));
};
