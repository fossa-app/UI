import { BridgeJsonSerializer } from 'shared/configs/BridgeSerializer';

describe('BridgeJsonSerializer', () => {
  const serializer = new BridgeJsonSerializer();

  it('serializes bridge model keys as camelCase JSON', () => {
    const result = serializer.Serialize({
      Name: 'Production',
      ParentDepartmentId: BigInt(444444444444),
      ManagerId: null,
      Address: {
        Line1: '100 Main St',
        CountryCode: 'US',
      },
    });

    expect(result).toBe(
      '{"name":"Production","parentDepartmentId":444444444444,"managerId":null,"address":{"line1":"100 Main St","countryCode":"US"}}'
    );
  });

  it('deserializes API camelCase JSON with PascalCase aliases for bridge clients', () => {
    const result = serializer.Deserialize<any>(
      '{"pageNumber":1,"items":[{"id":444444444444,"name":"Production","parentDepartmentId":null}],"totalItems":1}'
    );

    expect(result.pageNumber).toBe(1);
    expect(result.PageNumber).toBe(1);
    expect(result.items[0].name).toBe('Production');
    expect(result.Items[0].Name).toBe('Production');
    expect(result.Items[0].parentDepartmentId).toBeNull();
    expect(result.Items[0].ParentDepartmentId).toBeNull();
  });
});
