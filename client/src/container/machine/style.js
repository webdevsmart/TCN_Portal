import Styled from 'styled-components';

const TopToolBox = Styled.div`
    margin-bottom: 20px;
    /* // Toolbox Common Styles */
    .ant-row{
        align-items: center;
    }
    .table-toolbox-menu{
        margin: -10px;
        color: ${({ theme }) => theme['gray-color']};
        @media only screen and (max-width: 1599px){
            text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
        }
        @media only screen and (max-width: 991px){
            margin-top: 20px;
        }
        .ant-radio-button-wrapper{
            height: 40px;
            line-height: 40px;
            padding: 0 12.5px;
            &.active{
                span{
                    color: ${({ theme }) => theme['primary-color']};
                }
            }
        }
        @media only screen and (max-width: 991px){
            text-align: center;
        }
        .toolbox-menu-title,
        .ant-radio-group-outline{
            margin: 10px;
        }
    }
    .ant-select{
        @media only screen and (max-width: 1599px){
            margin-bottom: 20px;
        }
        @media only screen and (max-width: 767px){
            max-width: 350px;
            margin: 0 auto 20px;
        }
        .ant-select-selection-search{
            @media only screen and (max-width: 991px){
                width: 100% !important;
            }
            .ant-select-selection-search-input{
                min-width: 350px;
                @media only screen and (max-width: 1792px){
                    min-width: 230px;
                }
            }
        }
    }
    .search-result{
        margin: ${({ theme }) => (theme.rtl ? '0 25px 0 0' : '0 0 0 25px')};
        color: ${({ theme }) => theme['gray-color']};
        @media only screen and (max-width: 1599px){
            text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
            margin-bottom: 15px;
        }
        @media only screen and (max-width: 991px){
            text-align: center;
            margin-bottom: 18px;
        }
        @media only screen and (max-width: 991px){
            ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 0px;
        }
    }
    .ant-select-selector{
        height: 46px !important;
        .ant-select-selection-search-input{
            box-shadow: 0 5px 20px ${({ theme }) => theme['light-color']}3;
            border-radius: 23px;
            border: 0 none;
            input{
                height: 46px !important;
            }
        }
    }

    .ant-radio-group-outline{
        padding: 0 10px;
        border-radius: 5px;
        background: #fff;
        border: 1px solid ${({ theme }) => theme['border-color-normal']};
        @media only screen and (max-width: 1792px){
            padding: 0 5px;
        }
        @media only screen and (max-width: 991px){
            padding: 0;
        }
    }
    .ant-radio-button-wrapper{
        height: 40px;
        line-height: 42px;
        padding: 0 12px;
        border-color: ${({ theme }) => theme['border-color-normal']};
        border: 0 none !important;
        @media only screen and (max-width: 1792px){
            padding: 0 7.5px;
        }
        @media only screen and (max-width: 1599px){
            padding: 0 12.5px;
        }
        &.ant-radio-button-wrapper-checked{
            &:focus-within{
                box-shadow: 0 0;
            }
        }
        &:not(:first-child){
            &:before{
                display: none;
            }
        }
        &:not(:last-child){
            &:after{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0px;
                display: block;
                box-sizing: content-box;
                width: 1px;
                height: 50%;
                padding: 1px 0;
                background-color: #F1F2F6;
                transition: background-color 0.3s;
                content: '';
                z-index: 1;
                @media only screen and (max-width: 479px){
                    display: none;
                }
            }
        }
        span{
            color: ${({ theme }) => theme['light-color']};
            @media only screen and (max-width: 1792px){
                font-size: 13px;
            }
        }
        &.ant-radio-button-wrapper-checked{
            span{
                color: ${({ theme }) => theme['primary-color']};
            }
        }
    }

    // Product Toolbox Styles
    .product-list-action{
        @media only screen and (max-width: 991px){
            flex-flow: column;
            justify-content: center;
        }
    }
    .product-list-action__tab{
        margin: -10px;
        color: ${({ theme }) => theme['gray-color']};
        
        @media only screen and (max-width: 767px){
            margin-bottom: 15px;
            text-align: center;
        }
        @media only screen and (max-width: 991px) and (min-width: 768px){
            margin: -10px -10px 0;
        }
        @media only screen and (max-width: 575px){
            margin: -6px -6px 0;
        }
        @media only screen and (max-width: 344px){
            .ant-radio-group-outline{
                margin-top: 8px;
                ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 0;;
            }
        }
        .toolbox-menu-title,
        .ant-radio-group{
            margin: 10px;
            @media only screen and (max-width: 575px){
                margin: 6px
            }
        }
    }

    .product-list-action__viewmode{
        display: flex;
        align-items: center;
        a{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: ${({ theme }) => theme['light-color']};
            box-shadow: 0 5px 20px ${({ theme }) => theme['light-color']}10;
            &.active{
                background-color: #fff;
                color: ${({ theme }) => theme['primary-color']};
            }
        }
    }

    .table-search-box{
        @media only screen and (max-width: 991px){
            max-width: 600px;
            margin: 0 auto;
        }
        .ant-select{
            margin-bottom: 0;
        }
        .ant-select-selection-search{
            width: 100% !important;
            .ant-select-selection-search-input {
                border-radius: 20px;
                border: 0 none;
                background: ${({ theme }) => theme['bg-color-light']};
                height: 40px;
                input{
                    background: ${({ theme }) => theme['bg-color-light']};
                    height: 40px !important;
                }
            }
        }
    }
    .table-toolbox-actions{
        text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
        display: flex;
        justify-content: flex-end;
        align-items: center;
        @media only screen and (max-width: 1599px){
            margin-top: 20px;
            justify-content: center !important;
            text-align: center !important;
        }
        button{
            padding: 0px 13.4px;
            height: 38px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            svg,
            i{
                color: #fff;
            }
            &{
                +button{
                    ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 8px;
                }
            }
        }
    }
`;

const MachineCard = Styled.div`
  text-align: center;
  .user-card{
    &.theme-list{
      .ant-card-body{
        padding: 30px 25px 30px 30px !important;
        @media only screen and (max-width: 479px){
          padding: 25px 20px 25px 20px !important;
        }
      }
      figure{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        @media only screen and (max-width: 479px){
          flex-flow: column;
        }
        img{
          max-width: 80px;
          ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}:20px;
          @media only screen and (max-width: 479px){
            ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}:0px;
          }
        }
      }
      figcaption{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        text-align: left;
        @media only screen and (max-width: 379px){
          flex-flow: column;
        }
      }
      .card__content{
        p{
          max-width: 400px;
          font-size: 15px;
          color: ${({ theme }) => theme['gray-color']};
        }
        .card__designation{
            font-size: 13px;
            margin-bottom: 15px;
            color: ${({ theme }) => theme['light-color']};
        }
        .card-text{
          margin-bottom: 12px;
        }
        .card-info{
          margin-bottom: 0;
          .user-meta{
            font-size: 14px;
            strong{
              font-weight: 600;
              color: ${({ theme }) => theme['dark-color']};
            }
          }
          .user-meta + .user-meta{
            ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 20px;
          }
        }
      }
      .card__actions{
        text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')}
        @media only screen and (max-width: 379px){
          margin-top: 15px;
        }
        button{
          padding: 0px 19.05px;
          min-width: 114px;
        }
      }
    }
    &.theme-grid-2{
      .ant-card-body{
        padding: 0 !important;
      }
      figure{
        position: relative;
      }
      .user-card__img{
        margin-bottom: 0;
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 132px;
        height: 132px;
        border-radius: 50%;
        background-color: #fff;
        z-index: 22;
        img{
          position: relative;
          top: 6px;
        }
      }
      .user-card__bg{
        background-size: cover !important;
        background-position: center !important;
        border-radius: 10px 10px 0 0;
      }
      .card__bottom{
        position: relative;
        background-color: #fff;
        top: -26px;
        padding-top: 102px;
        border-radius: 30px 30px 10px 10px;
      }
    }
    &.theme-grid-3{
      .ant-card{
        text-align: left;
      }
      .ant-card-body{
        padding: 0 !important;
      }
      .card__top,
      .card__content,
      .card__info{
        padding: 0 30px;
      }
      .card__top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 30px;
        margin-bottom: 10px;
        .user-card__img{
          margin-right: 12px;
          ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 12px;
          img{
            max-width: 70px;
          }
        }
        .user-card__info{
          width: 100%;
          position: relative;
          .action-more{
            position: absolute;
            right: 0;
            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0;
            top: 0;
            color: #ADB4D2;
          }
          .card__designation{
            margin-bottom: 0;
          }
        }
      }
      .card__content{
        p{
          font-size: 15px;
          margin-bottom: 26px;
        }
        .image-group{
          margin: -3px;
        }
        img{
          max-width: 34px;
          margin: 3px;
        }
      }
      .card__info{
        padding-bottom: 30px;
        padding-top: 18px;
        .ant-progress-inner{
          position: relative !important;
        }
        p{
          font-size: 12px;
          color: ${({ theme }) => theme['light-color']};
        }
        h2{
          font-size: 14px;
          font-weight: 500;
          margin-top: 4px;
          margin-bottom: 16px;
        }
        .info-line{
          display: flex;
          justify-content: space-between;
          .success{
            color: ${({ theme }) => theme['success-color']};
          }
        }
        .completed-count{
          margin-top: 4px;
        }
        .project-progress{
          display: flex;
          justify-content: space-between;
          .progress-percentage{
            ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 20px;
            span{
              font-size: 12px;
              color: ${({ theme }) => theme['gray-color']};
            }
          }
        }
      }
    }
  }
  .card{
    position: relative;
    box-shadow: 0 5px 20px ${({ theme }) => theme['light-color']}03;
    .ant-card-body{
      padding: 30px !important;
      div{
        position: static;
      }
    }
    figure{
      margin-bottom: 0;
      img{
        margin-bottom: 20px;
        width: 100%;
        border-radius: 50%;
        max-width: 150px;
      }      
    }
    .card__more_actions{
      position: absolute;
      ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 24px;
      top: 20px;
      line-height: .5;
      padding: 5px 3px;
      color: ${({ theme }) => theme['extra-light-color']};
      box-shadow: 0 10px 20px #9299B815;
      svg,
      img{
        width: 20px;
      }
    }
    .card__name{
      font-size: 16px;
      margin-bottom: 6px;
      font-weight: 500;
      a{
        color: ${({ theme }) => theme['dark-color']};
        &:hover{
          color: ${({ theme }) => theme['primary-color']};
        }
      }
    }
    .card__designation{
      font-size: 13px;
      margin-bottom: 25px;
      color: ${({ theme }) => theme['light-color']};
    }
    .card__social{
      margin-top: 16px;
      a{
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px ${({ theme }) => theme['light-color']}15;
        background: #fff;
        &:not(:last-child){
          ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 10px;
        }
        &.facebook span.fa{
          color: #3B5998;
        }
        &.twitter span.fa{
          color: #1DA1F2;
        }
        &.dribble span.fa{
          color: #C2185B;
        }
        &.instagram span.fa{
          color: #FF0300;
        }
      }
    }
  }

  .user-card{
    .ant-card-body{
      padding: 30px 25px 18px 25px !important;
      @media only screen and (max-width: 1599px){
        padding: 20px  20px 20px !important;
      }
      @media only screen and (max-width: 767px){
        padding: 15px  15px 15px !important;
      }
    }
    figure{
      img{
        margin-bottom: 18px;
        max-width: 120px;
      }      
    }
    .card__actions{
      margin: -5px;
      .ant-btn-white{
        color: ${({ theme }) => theme['gray-color']};
        border: 1px solid ${({ theme }) => theme['border-color-light']};
        &:hover{
          border: 1px solid ${({ theme }) => theme['primary-color']};
        }
      }
      button{
        font-size: 13px;
        padding: 0px 22.7px;
        height: 38px;
        border-radius: 6px;
        box-shadow: 0px 3px 5px ${({ theme }) => theme['light-color']}05;
        margin: 5px;
        &:hover{
          color: #fff !important;
          background-color: ${({ theme }) => theme['primary-color']} !important;
          svg,
          i{
            color: #fff;
          }
        }
        svg,
        i{
          color: ${({ theme }) => theme['light-color']};
        }
      }
    }
    .card__info{
      padding-top: 20px;
      margin-top: 18px;
      border-top: 1px solid ${({ theme }) => theme['border-color-light']};
      .info-single{
        text-align: center;
      }
      .info-single__title{
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 4px;
      }
      p{
        margin-bottom: 0;
        color: ${({ theme }) => theme['light-color']};
      }
    }
  }
`;

const MachineCardWrapper = Styled.nav`
  .user-card-pagination{
    margin: 15px 0 40px 0;
    text-align: ${({ theme }) => (!theme.rtl ? 'right' : 'left')};
    @media only screen and (max-width: 991px){
      text-align: center;
    }
  }
`;

const EditAisleForm = Styled.div`
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

    .ImageFile-uploader {
      display: flex;
      justify-content: center;
    }
`;

const DetailStyleWrapper = Styled.div`
  .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60%;
    height: auto;
  }

  .upload-wrapper {
    padding-left: 20%;
  }
`;

const DragDropStyle = Styled.div`
    .ant-card-body{
        padding: 15px !important;
    }
    table{
        thead{
            display: none;
        }
        tbody{
            >tr{
                &:not(:last-child){
                    td{
                         border-bottom: 1px solid ${({ theme }) => theme['border-color-normal']} !important;
                    }
                 }
                 &:hover{
                     td{
                         background-color: transparent !important;
                     }
                 }
                >td{
                    font-size: 14px;
                    &:first-child,
                    &:last-child{
                        border-radius: 0 !important;
                    }
                }
            }
        }
        tr{
            td{
                &.drag-visible{
                    svg,
                    img{
                        width: 20px;
                    }
                    svg,
                    i{
                        color: ${({ theme }) => theme['extra-light-color']} !important;
                    }
                }
            }
        }
        .user-info{
            .user-name{
                font-size: 14px;
                margin-left: 8px;
            }
        }
    }
`;

export {
    TopToolBox,
    MachineCard,
    MachineCardWrapper,
    EditAisleForm,
    DetailStyleWrapper,
    DragDropStyle
};