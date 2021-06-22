import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Badge, Table } from 'antd';
import Axios from 'axios';
import FeatherIcon from 'feather-icons-react';
import { format } from 'date-fns';

import { Button } from '../../../../components/buttons/buttons';

const TransactionTable = ( { showDetailModal } ) => {
  const { filter } = useSelector(state => {
    return {
      filter: state.filterDashboard.data
    };
  });
  
	const [state, setState] = useState({
		start: 0,
		length: 10,
		sort: "time",
		sortDir: "asc",
	});

	const [transactionList, setTransactionList] = useState({
		list: [],
		totalSize: 0
	});

	const transactionDataSource = [];
	const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
			sorter: (a, b) => a.realStatus.length - b.realStatus.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
			onFilter: (value, record) => record.realStatus.indexOf(value) === 0,
      sorter: (a, b) => a.realStatus.length - b.realStatus.length,
    },
    {
      title: 'Site ID',
      dataIndex: 'siteID',
      key: 'siteID',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Sub Type',
      dataIndex: 'subType',
      key: 'subType',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Product Price',
      dataIndex: 'productPrice',
      key: 'productPrice',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
			onFilter: (value, record) => record.realPrice.indexOf(value) === 0,
      sorter: (a, b) => a.realPrice - b.realPrice,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: 'Refund',
      dataIndex: 'refund',
      key: 'refund',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      width: '90px',
    },
  ];

	// set transaction datatable datasource
  transactionList.list.map((value, index) => {
    const { _id, time, status, siteID, type, subType, product, fee, refund, billLevel } = value;
    return transactionDataSource.push({
      key: index,
      time: format(new Date(time), 'yyyy-MM-dd hh:mm:ss'),
      status: status === "success" ? <Badge count={status}  style={{ backgroundColor: '#20C997' }}/> : <Badge count={status} />,
      siteID,
      type,
      subType,
      product: product.productID,
      productPrice: ("$" + (Math.round(product.price) / 100).toFixed(2)),
      price: type === 'CASH' && subType === 'BILL' ? 
        ("$" + (Math.round(billLevel)).toFixed(2)) : 
        ("$" + (Math.round(product.price) / 100).toFixed(2)),
			realStatus: status,
			fee: fee,
			refund: refund,
      action: (
        <div className="table-actions">
          <>
          <Button className="btn-icon" type="info" to="#" shape="circle" onClick={() => showDetailModal(_id)}>
            <FeatherIcon icon="eye" size={16} />
          </Button>
          </>
        </div>
      ),
    });
  });
	
	useEffect(() => {
		const getTransactionList = () => {
			let url = "/api/sale/total/getTransactionList";
			let data = {
        filter: filter,
        pageFilter: state
			}
			Axios.post(url, {data})
			.then(res => {
  			setTransactionList(res.data.data);
			})
		}
		getTransactionList();
	}, [ filter, filter.siteID, filter.date, filter.productID, filter.paymentType, state ]);

	const onChange = (pagination, filters, sorter, extra) => {
		setState({...state, start: (pagination.current - 1) * pagination.pageSize, length: pagination.pageSize, sort: sorter.field, sortDir: sorter.order});
	}

	return (
		
    <Table className="table-responsive" 
      pagination={{
      defaultPageSize: state.length,
      total: transactionList.totalSize,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      dataSource={transactionDataSource}
      columns={columns} 
      onChange={onChange}/>
	);
}

export default TransactionTable;