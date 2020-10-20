export const NavMenu = [
    {
        name: 'Home',
        anchorId: 'home',
        icon: 'assets/images/icons/home.svg'
    },
    // {
    //     name: 'About',
    //     anchorId: 'about',
    //     icon: 'assets/images/icons/work.svg'
    // },
    {
        name: 'Book',
        anchorId: 'appointment',
        icon: 'assets/images/icons/chat.svg'
    },
    {
        name: 'Gallery',
        anchorId: 'gallery',
        icon: 'assets/images/icons/gallery.svg'
    },
    {
        name: 'Videos',
        anchorId: 'videos',
        icon: 'assets/images/icons/film.svg'
    },
    {
        name: 'Enquiry',
        anchorId: 'enquiry',
        icon: 'assets/images/icons/chat.svg'
    }
    
]

export const ImagesPerPage = 6;
export const VideosPerPage = 3;
export const ScrollOffset = 48;

export const AppointmentsTabLinks = [
    { name: 'Appointments', value: 'dashboard', active: true },
    { name: 'Calender', value: 'calender', active: false },
    { name: 'Reminders', value: 'reminders', active: false }
];

export const CustomersTabLinks = [
    { name: 'Clients', value: 'clients', active: true },
    { name: 'Pets', value: 'pets', active: false },
];

export const pageSizeOptions = [5, 10, 25, 50];
export const pageLimit = 5;

export const ClientDetailsTabLinks = [
    { name: 'Pets', value: 'pets', active: true },
    { name: 'Appointments', value: 'Appointments', active: false },
    { name: 'Reminders', value: 'Reminders', active: false },
];

export const SettingsTabLinks = [
    { name: 'Profile', value: 'profile', active: true },
    { name: 'Partner', value: 'partner', active: false},
    { name: 'Timings', value: 'timings', active: false}
    // { name: 'Customer Profile', value: 'customer-profile', active: false },
    // { name: 'Ecard Media', value: 'ecard-media', active: false }
];
