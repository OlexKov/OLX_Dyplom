import { useCallback } from "react"
import { useGetAllFilterQuery } from "../../redux/api/filterApi"
import { CategoryFiltersProps } from "./props"
import Filter from "../filter"
import { Button, Form } from "antd"


const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categoryFiltersIds, onChange }) => {
    const [form] = Form.useForm()
    const { data: filters } = useGetAllFilterQuery()
    const getCategoryFilters = useCallback(() => filters?.filter(x => categoryFiltersIds?.includes(x.id)) || [], [categoryFiltersIds])
    const onFinish = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && ((x as []).length > 0)) as number[][];
        if (onChange) {
            onChange(result)
        }
    }

    const onReset = (key: number | undefined) => {
        if (onChange) {
            if (key) {
                form.setFieldValue(key, [])
                form.submit()
            }
            else {
                form.resetFields()
                onChange([])
            }
        }
    }

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical">
            {getCategoryFilters()?.map((filter) =>
                <Filter
                    key={filter.id}
                    filter={filter}
                    onChange={() => form.submit()}
                    onReset={onReset} />
            )}
            {getCategoryFilters()?.length > 0 &&
                <Button
                    size="small"
                    className=" self-start  text-[red]"
                    type='text'
                    onClick={() => onReset(undefined)} >
                    Очистити всі
                </Button>
            }
        </Form>
    )
}

export default CategoryFilters