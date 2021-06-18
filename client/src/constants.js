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
    'cms', 'm'
];

const WEIGHT_UNIT = [
    'gms', 'kg'
];

const YES = 'Yes'; 
const NO = 'No'; 

const IMAGE_UPLOAD_URL = '/uploads/images/';

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
    WEIGHT_UNIT
};
