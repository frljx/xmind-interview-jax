export interface ISearchParams {
  month: number
  type: string
  category: string
}

export interface IDataItem {
  [name: string]: any
}

export type IDataList = Array<IDataItem>
