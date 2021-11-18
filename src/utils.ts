export interface ITODO {
  id: string;
  content: string;
  orderId: number;
  isCompleted: boolean;
}


export function conditionPlural(condition: number) {
  if (condition > 1)
    return 's'
  return ''
}


