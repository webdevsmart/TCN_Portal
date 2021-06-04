import React, {useEffect, useState} from 'react';
import { Col, Select, Badge, Table } from 'antd';
import axios from 'axios';
import { Cards } from '../../components/cards/frame/cards-frame';

const { Option } = Select;

const TransactionTable = ( dateRange ) => {
	const [state, setState] = useState({
		start: 0,
		length: 10,
		sort: "time",
		sortDir: "asc",
		selectedMachine: [],
	});

	const [machines, setMachines] = useState([]);
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
      title: 'Device Name',
      dataIndex: 'devName',
      key: 'devName',
    },
    {
      title: 'Machine UID',
      dataIndex: 'machineUID',
      key: 'machineUID',
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
  ];

	// set transaction datatable datasource
  transactionList.list.map((value, index) => {
    const {time, status, devName, machineUID, product, price } = value;
    return transactionDataSource.push({
      key: index,
      time,
      status: status === "success" ? <Badge count={status}  style={{ backgroundColor: '#20C997' }}/> : <Badge count={status} />,
      devName,
      machineUID,
      product: product.productId,
      price: (
        "$" + Math.round(product.price) / 100
      ),
			realStatus: status,
			realPrice: product.price,
    });
  });
	
	useEffect(() => {
		const getTransactionList = () => {
			let url = "/api/dashboard/getDetail";
			let data = {
			machineUIDs: state.selectedMachine,
					start: state.start,
					length: state.length,
					sort: state.sort,
					sortDir: state.sortDir,
					dateRange: dateRange,
			}
			axios.post(url, {data})
			.then(res => {
			setTransactionList(res.data.data);
			})
		}
		getTransactionList();
	}, [state, dateRange]);
	
	// one time call for getting machine namelist
	useEffect(() => {
		getMachineNameList();
	}, [])
	
	const getMachineNameList = () => {
		let url = "/api/dashboard/getMachineList";
    axios.get(url)
    .then(res => {
			if (res.data.status === "success") {
				setMachines(res.data.data)
      }
    });
	}

	

	const onChange = (pagination, filters, sorter, extra) => {
		setState({...state, start: (pagination.current - 1) * pagination.pageSize, length: pagination.pageSize, sort: sorter.field, sortDir: sorter.order});
	}

	const selectMachine = (value) => {
		setState({...state, selectedMachine: value, start: 0});
	}

	return (
		<Cards title="Transaction Detail">
			<Col md={6} xs={24}>
				<Select
				mode="multiple"
				style={{ width: '100%' }}
				placeholder="Select Machines"
				defaultValue={[]}
				optionLabelProp="label"
				onChange={selectMachine}
				>
				{
				machines.map((machine, index) => {
					return <Option value={machine.UID} label={machine.devName} key={index}>
					{machine.devName}
					</Option>;
					})
				}

				</Select>
			</Col>
			<Col xs={24}>
				<Cards title="Basic Usage">
					<Table className="table-responsive" 
						pagination={{
              defaultPageSize: state.length,
              total: transactionList.totalSize,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
						dataSource={transactionDataSource}
						columns={columns} 
						onChange={onChange}/>
				</Cards>
			</Col>
		</Cards>
	);
}

export default TransactionTable;