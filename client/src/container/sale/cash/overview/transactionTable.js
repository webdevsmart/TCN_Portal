import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Col, Badge, Table } from 'antd';
import axios from 'axios';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import { format } from 'date-fns';

const TransactionTable = (  ) => {
  const { filter } = useSelector(state => {
    return {
      filter: state.filterDashboard.data
    };
  });
  
  console.log("tset")

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
			sorter: (a, b) => a.time.length - b.time.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
			onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Site ID',
      dataIndex: 'siteID',
      key: 'siteID',
    },
    {
      title: 'Cash Type',
      dataIndex: 'subType',
      key: 'subType',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
			onFilter: (value, record) => record.realPrice.indexOf(value) === 0,
      sorter: (a, b) => a.realPrice - b.realPrice,
    },
    {
      title: 'Refund',
      dataIndex: 'refund',
      key: 'refund',
    },
  ];

	// set transaction datatable datasource
  transactionList.list.map((value, index) => {
    const {time, status, siteID, subType, product, refund } = value;
    return transactionDataSource.push({
      key: index,
      time: format(new Date(time), 'yyyy-MM-dd hh:mm:ss'),
      status: status === "success" ? <Badge count={status}  style={{ backgroundColor: '#20C997' }}/> : <Badge count={status} />,
      siteID,
      subType,
      product: product.productID,
      price: (
        "$" + Math.round(product.price) / 100
      ),
			realStatus: status,
			realPrice: product.price,
			refund: "$ " + refund / 100,
    });
  });
	
	useEffect(() => {
		const getTransactionList = () => {
			let url = "/api/sale/total/getTransactionList";
			let data = {
        filter: filter,
        pageFilter: state,
        type: 'CASH'
			}
			axios.post(url, {data})
			.then(res => {
  			setTransactionList(res.data.data);
			})
		}

    getTransactionList();
	}, [ filter.siteID, filter.date, filter.productID, filter.paymentType, state ]);

	const onChange = (pagination, filters, sorter, extra) => {
		setState({...state, start: (pagination.current - 1) * pagination.pageSize, length: pagination.pageSize, sort: sorter.field, sortDir: sorter.order});
	}

	return (
		<Cards title="Transaction Detail">
			<Col xs={24}>
        <Table className="table-responsive" 
          pagination={{
          defaultPageSize: state.length,
          total: transactionList.totalSize,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          dataSource={transactionDataSource}
          columns={columns} 
          onChange={onChange}/>
			</Col>
		</Cards>
	);
}

export default TransactionTable;