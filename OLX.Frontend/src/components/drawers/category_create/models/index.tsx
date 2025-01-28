import { ICategory } from "../../../../models/category"

export interface CategoryPreviewModel {
    previewOpen: boolean
    previewImage: string
    previewTitle: string
}
export interface CategoryFilterDataModel {
    excludedFilters: number[]
    categoryTree: ICategory[]

}