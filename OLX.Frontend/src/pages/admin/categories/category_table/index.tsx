import { Avatar, Button, Input, Pagination, Popconfirm, Table, TableColumnsType, TableProps, Tooltip } from "antd";
import { PageHeader } from "../../../../components/page_header";
import { ProfileOutlined, SearchOutlined } from '@ant-design/icons';
import { ICategory, ICategoryPageRequest } from "../../../../models/category";
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
import { Key, useEffect, useState } from "react";
import { useGetCategoryPageQuery } from "../../../../redux/api/categoryApi";
import { IconButton } from "@mui/material";
import { AddCircleOutline, CachedOutlined, DeleteForever, EditCalendar, SearchOff } from "@mui/icons-material";
import { APP_ENV } from "../../../../constants/env";
import PageHeaderButton from "../../../../components/page_header_button";
import { ColumnType } from "antd/es/table";
import AdminCategoryCreate from "../../../../components/drawers/category_create";
const AdminCategoryTable: React.FC = () => {

    const [pageRequest, setPageRequest] = useState<ICategoryPageRequest>({
        size: paginatorConfig.pagination.defaultPageSize,
        page: paginatorConfig.pagination.defaultCurrent,
        sortKey: '',
        isDescending: false,
        searchName: "",
        parentName: ""
    })
    const [search, setSearch] = useState<ICategoryPageRequest>(pageRequest as ICategoryPageRequest)
    const { data, isLoading, refetch } = useGetCategoryPageQuery(pageRequest)
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [selectedCategory,setSelectedCategory] = useState<ICategory | undefined>();


    const getColumnSearchProps = (dataIndex: keyof ICategoryPageRequest): ColumnType<ICategory> => ({
        filterDropdown: () => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Пошук`}
                    value={search[dataIndex] as string}
                    onChange={(e) => setSearch((prev) => ({ ...prev, [dataIndex]: e.target.value }))}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            if (search[dataIndex] !== '') {
                                setPageRequest(search)
                            }
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Знайти
                    </Button>
                    <Button
                        onClick={() => {
                            if (search[dataIndex] !== '') {
                                const newSearch = ({ ...search, [dataIndex]: '' })
                                setSearch(newSearch)
                                setPageRequest(newSearch)
                            }
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Очистити
                    </Button>
                </div>
            </div>
        ),
        filterIcon: () => (
            <SearchOutlined style={{ width: 20, color: search[dataIndex] !== '' ? '#1890ff' : undefined }} />
        ),
    });

    const editCategory = (category:ICategory)=>{
        setSelectedCategory(category);
        setIsDrawerOpen(true)
    }
    const columns: TableColumnsType<ICategory> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            width: 50,
            fixed: 'left',
            align: 'center',
            sorter: true,
        },

        {
            title: 'Фото',
            dataIndex: 'photo',
            key: 'photo',
            ellipsis: true,
            render: (_, category: ICategory) => category.image ? <Avatar src={APP_ENV.IMAGES_100_URL + category.image} size={40} /> : null,
            width: 60,
            fixed: 'left',
            align: 'center'
        },

        {
            title: "Назва",
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 240,
            sorter: true,
            fixed: 'left',
            ...getColumnSearchProps('searchName')
        },
        
        {
            title: "Батьківська категорія",
            dataIndex: 'parentName',
            key: 'parentName',
            ellipsis: true,
            width: 240,
            sorter: true,
            render: (_, category: ICategory) => category.parentName ? category.parentName : '---------',
            ...getColumnSearchProps('parentName')
        },
        {
            title: "Дочірні категорії",
            dataIndex: 'childs',
            key: 'childs',
            ellipsis: true,
            minWidth: 150,
            width: 'auto',
            render: (_, category: ICategory) =>
                <div className=" text-xs text-gray-500">
                    {category.childs.map(x => x.name).join(' | ')}
                </div>,

        },
        {
            title: "Фільтри",
            dataIndex: 'filterNames',
            key: 'filterNames',
            ellipsis: true,
            width: 'auto',
            minWidth: 150,
            render: (_, category: ICategory) =>
                <div className=" text-xs text-gray-500">
                    {category.filterNames.join(' | ')}
                </div>,

        },

        {
            key: 'actions',
            width: 100,
            render: (_, category: ICategory) =>
                <div className='flex justify-around'>
                    <Tooltip title="Редагувати категорію">
                        <IconButton onClick={() => { editCategory(category) }} color="success" size="small">
                            <EditCalendar />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Видалити категорію">
                        <Popconfirm
                            title="Відалення категорії"
                            description={`Ви впевненні що бажаєте видалити категорію "${category.name}"?`}
                            onConfirm={() => { }}
                            okText="Видалити"
                            cancelText="Відмінити"
                        >
                            <IconButton color="error" size="small">
                                <DeleteForever />
                            </IconButton>
                        </Popconfirm>
                    </Tooltip>
                </div>,
            fixed: 'right',
            align: 'center'
        }

    ];
    const onTableChange: TableProps<ICategory>['onChange'] = (_pagination, _filters, sorter, extra) => {
        if (extra.action === 'sort') {
            let descending: boolean;
            let key: Key | undefined;
            if (Array.isArray(sorter)) {
                const firstSorter = sorter[0];
                descending = firstSorter.order === 'descend';
                key = firstSorter.columnKey;
            } else {
                descending = sorter.order === 'descend';
                key = sorter.columnKey;
            }
            setPageRequest((prev) => ({ ...prev, isDescending: descending, sortKey: key?.toString() }))
        }
    }

    const onPaginationChange = (currentPage: number, pageSize: number) => {
        setPageRequest({ ...pageRequest, page: currentPage, size: pageSize })
    }

    useEffect(() => {
        (async () => {
            await refetch()
        })()
    }, [pageRequest])

    const onDrawerClose = () => {
        
        setIsDrawerOpen(false)
        setSelectedCategory(undefined);
    }

    return (
        <div className="m-6 flex-grow  text-center overflow-hidden">
            <AdminCategoryCreate
                open={isDrawerOpen} 
                onClose={onDrawerClose } 
                category={selectedCategory}           
            />
            <PageHeader
                title="Категорії"
                icon={<ProfileOutlined className="text-2xl" />}
                buttons={[
                    <PageHeaderButton
                        key='clear_filter'
                        onButtonClick={() => {
                            setPageRequest((prev) => ({
                                ...prev,
                                searchName: "",
                                parentName: ""
                            }))
                        }}
                        className="w-[35px] h-[35px] bg-red-900"
                        buttonIcon={<SearchOff className="text-lg" />}
                        tooltipMessage="Очистити фільтри"
                        tooltipColor="gray"
                        disabled={
                            pageRequest.searchName === '' &&
                            pageRequest.parentName === ''} />,
                    <PageHeaderButton
                        key='add'
                        onButtonClick={() => setIsDrawerOpen(true)}
                        className="w-[35px] h-[35px] bg-green-700"
                        buttonIcon={<AddCircleOutline className="text-lg" />}
                        tooltipMessage="Додати категорію"
                        tooltipColor="gray" />,
                    <PageHeaderButton
                        key='reload'
                        onButtonClick={refetch}
                        className="w-[35px] h-[35px] bg-sky-700"
                        buttonIcon={<CachedOutlined className="text-lg" />}
                        tooltipMessage="Перезавантажити"
                        tooltipColor="gray" />
                ]}
            />
            <Table<ICategory>
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={data?.items}
                scroll={{ x: 'max-content'}}
                loading={isLoading}
                bordered
                pagination={false}
                showSorterTooltip={{ target: 'sorter-icon' }}
                onChange={onTableChange}
            />

            {((data?.total || 0) > paginatorConfig.pagination.defaultPageSize) &&
                <Pagination
                    align="center"
                    showSizeChanger
                    pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                    locale={paginatorConfig.pagination.locale}
                    showTotal={paginatorConfig.pagination.showTotal}
                    current={pageRequest.page}
                    total={data?.total}
                    pageSize={pageRequest.size}
                    onChange={onPaginationChange}
                    className='mt-4' />
            }
        </div>)

};

export default AdminCategoryTable;