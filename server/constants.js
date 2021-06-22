const ROLE_MEMBER = 'Member';
const ROLE_CLIENT = 'Client';
const ROLE_OWNER = 'Owner';
const ROLE_ADMIN = 'Admin';

const STATUS_ACTIVE = 'Active'; 
const STATUS_DEACTIVE = 'Inactive'; 

const RELEASE_TYPE = [
    'Spiral',
    'Conveyor',
    'Claw',
    'Other'
]

const LENGTH_UNIT = [
    'cms', 'mms'
];

const WEIGHT_UNIT = [
    'gms', 'kgs'
];

const PRICE_UNIT = [
    'AUD$', 'USD$'
];

const YES = 'Yes'; 
const NO = 'No'; 

const IMAGE_UPLOAD_URL = '/uploads/images/';
const LOG_FILE_PATH = "D:/Workspace/0514_vending_portal/vgc2_backup/";
// const LOG_FILE_PATH = "/home/vending/vgc2_backup/";

module.exports = { 
    ROLE_MEMBER, 
    ROLE_CLIENT, 
    ROLE_OWNER, 
    ROLE_ADMIN,
    STATUS_ACTIVE,
    STATUS_DEACTIVE,
    RELEASE_TYPE,
    YES,
    NO,
    IMAGE_UPLOAD_URL,
    LENGTH_UNIT,
    WEIGHT_UNIT,
    PRICE_UNIT,
    LOG_FILE_PATH
};
