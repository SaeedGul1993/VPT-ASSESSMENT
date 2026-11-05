export const tagTypes = ['Auth', 'Households', 'Members', 'Assessments'] as const;

export type ApiTagType = (typeof tagTypes)[number];

export const LIST = 'LIST';

export const listTagOf = (type: ApiTagType) => [{ type, id: LIST }] as const;
