import Styled from 'styled-components';

const AddProductForm = Styled.div`
margin-top: 28px;
@media only screen and (max-width: 575px){
    margin-top: 15px;
}
.ant-select-arrow{
    ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 11px;
}

.ant-table table {
    text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
}
.add-product-block{
    background: ${({ theme }) => theme['bg-color-light']};
    border-radius: 20px;
    padding: 30px;
    border: 1px solid ${({ theme }) => theme['bg-color-light']};
    @media only screen and (max-width: 575px){
        padding: 20px;
    }
    &:not(:last-child){
        margin-bottom: 30px;
    }
    .ant-card{
        margin-bottom: 0 !important;
        border-radius: 20px;
    }
    .add-product-content{
        box-shadow: 0 10px 30px ${({ theme }) => theme['light-color']}10;
        border-radius: 20px;
        .ant-card-head{
            padding: 0 40px !important;
            border-radius: ${({ theme }) => (theme.rtl ? '20px 0 0 20px' : '20px 20px 0 0')};
            @media only screen and (max-width: 575px){
                padding: 0 15px !important;
            }
        }
        .ant-card-head-title{
            padding: 26px 0 25px;
        }
        .ant-card-body{
            padding: 26px 40px 40px !important;
            @media only screen and (max-width: 575px){
                padding: 20px !important;
            }
        }
    }
    .ant-upload{
        border-spacing: 6px;
        border-width: 2px;
        border-radius: 10px;
        background: ${({ theme }) => theme['bg-color-light']};
        border-color: ${({ theme }) => theme['border-color-deep']};
        padding: 50px;
        @media only screen and (max-width: 575px){
            padding: 15px !important;
        }
        .ant-upload-drag-icon{
            i,
            svg{
                color: ${({ theme }) => theme['extra-light-color']};
            }
        }
        .ant-upload-text{
            font-weight: 500;
            margin-bottom: 8px;
        }
        .ant-upload-hint{
            font-size: 15px;
            font-weight: 500;
            color: ${({ theme }) => theme['gray-color']};
            span{
                color: ${({ theme }) => theme['secondary-color']};
            }
        }
    }
    .ant-upload-list-item{
        height: 100%;
        padding: 0;
        border: 0 none;
        margin-top: 25px;
    }
    .ant-upload-list-item-info{
        height: 100%;
        >span{
            display: flex;
            align-items: center;
        }
        .ant-upload-list-item-name{
            padding: 0 10px;
            font-weight: 500;
            color: ${({ theme }) => theme['dark-color']};
            &:hover{
                color: ${({ theme }) => theme['primary-color']};
            }
        }
        .ant-upload-list-item-card-actions{
            position: relative;
            top: 0;
            i,
            svg{
                width: 15px;
                color: ${({ theme }) => theme['danger-color']};
            }
        }
        .ant-upload-list-item-thumbnail{
            position: relative;
            top: 0;
            min-width: 100px;
            width: auto;
            height: 100%;
            img{
                max-width: 100px;
                width: 100%;
                height: 100%;
                border-radius: 6px;
            }
        }
    }
}
.add-form-action{
    text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
    margin-top: 40px;
    .ant-form-item-control-input{
        button{
            height: 50px;
            padding: 0 22.82px;
        }
    }
    button{
        font-size: 15px;
        font-weight: 400;
        height: 50px;
    }
    .btn-cancel{
        border: 1px solid ${({ theme }) => theme['border-color-light']};
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 20px;
        background: ${({ theme }) => theme['bg-color-light']};
    }
}
`;

export {
    AddProductForm,
};