import React, { useState } from 'react';
import { AutoComplete } from '../../../components/autoComplete/autoComplete';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Button } from '../../../components/buttons/buttons';
import { Main, CardToolbox } from '../../styled';
import CreateCategory from './createCategory';
import CategoryTable from './categoryTable';

const Category = () => {
  const [state, setState] = useState({
    visible: false,
    refresh: false,
    selectedCategory: "",
    totalCategoryCount: 0,
    keyword: ""
  });
  const { visible } = state;
  
  const showModal = ( selectedCategory = "" ) => {
    setState({
      ...state,
      visible: true,
      selectedCategory: selectedCategory,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  const setTableRefresh = () => {
    setState({
      ...state,
      refresh: true
    })
  }

  const handleSearch = searchText => {
    setState({
      ...state,
      keyword: searchText
    })
  };

  return (
    <>
      <CardToolbox>
        <PageHeader
          ghost
          title="Product Category"
          subTitle={
            <>
              <AutoComplete
                onSearch={handleSearch}
                placeholder="Search by Name"
                width="100%"
                patterns
              />
            </>
          }
          buttons={[
            <Button className="btn-add_new" size="default" type="primary" key="1" onClick={() => showModal("")}>
              + Add New Category
            </Button>,
          ]}
        />
      </CardToolbox>

      <Main>
        <CreateCategory onCancel={onCancel} visible={visible} setTableRefresh={setTableRefresh} selectedCategory={state.selectedCategory}/>
        <CategoryTable refresh={state.refresh} showModal={showModal} keyword={state.keyword} />
      </Main>
    </>
  );
};

export default Category;
