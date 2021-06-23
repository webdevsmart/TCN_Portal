import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { Badge, Table } from 'antd';
import axios from 'axios';
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
    {
      title: 'Tube Level Change',
      dataIndex: 'tubeLevelChange',
      key: 'tubeLevelChange',
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
    const { _id, time, status, siteID, subType, product, refund, tubeLevelBefore, tubeLevelAfter } = value;
    let levelChange = ""
    let levelBeforeArray = tubeLevelBefore.split(" ");
    let levelAfterArray = tubeLevelAfter.split(" ");
    levelBeforeArray.map( (item, index) => {
      if ( item.trim() !== '' && item.trim() !== '0') {
        let spanTagClass = item * 1 > levelAfterArray[index] * 1 ? 'color-warning' : 'color-primary';
        levelChange += item + "/" + levelAfterArray[index] + ", ";
      }
    })
    console.log(levelChange)
    return transactionDataSource.push({
      key: index,
      time: format(new Date(time), 'yyyy-MM-dd HH:mm:ss'),
      status: status === "success" ? <Badge count={status}  style={{ backgroundColor: '#20C997' }}/> : <Badge count={status} />,
      siteID,
      subType,
      product: product.productID,
      price: (
        "$" + (Math.round(product.price) / 100).toFixed(2)
      ),
			realStatus: status,
			realPrice: product.price,
			refund: "$ " + (refund / 100).toFixed(2),
      tubeLevelChange: levelChange,
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