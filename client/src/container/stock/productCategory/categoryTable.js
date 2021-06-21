import React, {useEffect, useState} from 'react';
import { Table, notification, Modal } from 'antd';
import Axios from 'axios';
import { format } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { TableStyleWrapper } from '../style';
import { TableWrapper } from '../../styled';
import SampleImage from '../../../static/img/sample-product.png';

const confirm = Modal.confirm;

const CategoryTable = ({refresh, showModal, keyword}) => {
	const [state, setState] = useState({
		start: 0,
		length: 5,
		sort: "time",
		sortDir: "asc",
		filter: keyword
	});

	const [categoryList, setCategoryList] = useState({
		list: [],
		totalSize: 0
	});

	const categoryDataSource = [];
	const columns = [
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
		title: 'Image',
		dataIndex: 'imageUrl',
		key: 'imageUrl',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      width: '90px',
    },
  ];

	const deleteCategory = ( _id ) => {
		confirm({
			title: 'Delete this Category?',
			okText: 'Yes',
			onOk() {
        Axios.post('/api/stock/productCategory/deleteCategory', { _id: _id })
        .then( res => {
          if (res.data.status === 'success') {
            notification["success"]({
              message: 'Success',
              description: 
              'Successfully Done!',
            });
            getCategoryList();
          } else {
            notification["warning"]({
              message: 'Warning',
              description: 
              'Server Error',
            });
          }
        })
        .catch (err => {
          notification["warning"]({
            message: 'Warning',
            description: 
            'Server Error',
          });
        });
			},
			onCancel() {},
    });
	}

	// set transaction datatable datasource
	categoryList.list.map((value, index) => {
		const { _id, createdAt, imageUrl, code, name } = value;
    const time = new Date(createdAt);
		return categoryDataSource.push({
		key: _id,
		createdAt: format(time, 'yyyy/MM/dd kk:mm:ss'),
		code,
		imageUrl: (
		<figure>
			<img src={imageUrl === undefined ? SampleImage : `/uploads/products/${imageUrl}`} alt={`img`} style={{ maxWidth: '120px' }} />
		</figure>
    ),
		name,
		action: (
			<div className="table-actions">
				<>
				<Button className="btn-icon" type="info" to="#" shape="circle" onClick={() => showModal(_id)}>
					<FeatherIcon icon="edit" size={16} />
				</Button>
				<Button className="btn-icon" type="danger" to="#" shape="circle" onClick={() => deleteCategory(_id)}>
					<FeatherIcon icon="trash-2" size={16} />
				</Button>
				</>
			</div>
			),
		});
	});
	
	useEffect(() => {
    getCategoryList();
	}, [state, refresh, keyword]);
	
  const getCategoryList = () => {
    let url = "/api/stock/productCategory/getCategoryList";
    let data = {
      start: state.start,
      length: state.length,
      sort: state.sort,
      sortDir: state.sortDir,
      keyword: keyword
    }
    Axios.post(url, {data})
    .then(res => {
      setCategoryList(res.data.data);
    })
  }

	const onChange = (pagination, sorter) => {
		setState({...state, start: (pagination.current - 1) * pagination.pageSize, length: pagination.pageSize, sort: sorter.field, sortDir: sorter.order});
	}

	return (
		<Cards title="Category List">
			<TableStyleWrapper>
			<TableWrapper className="table-responsive">
				<Table className="table-responsive" 
					pagination={{
					defaultPageSize: state.length,
					total: categoryList.totalSize,
					showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
					}}
					dataSource={categoryDataSource}
					columns={columns} 
					onChange={onChange}/>
			</TableWrapper>
			</TableStyleWrapper>
		</Cards>
	);
}

export default CategoryTable;