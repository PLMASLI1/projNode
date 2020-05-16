var config = module.exports = {

    frontendDir: './public',
    port: 8888,
    dbUrl: "mongodb://localhost:27017",
    database: "app2020",
    defaultLimit: 10,

    exampleUsers: [
        {login: "admin", password: "admin1", role: 1 }
    ],

    examplePersons: [
        {
            firstName: 'Mariusz',
            lastName: 'Jarocki',
            email: 'mariusz.jarocki@wmii.uni.lodz.pl',
            yearofbirth: 1969
        },
        {
            firstName: 'Jim',
            lastName: 'Beam',
            email: 'jimbeam@gmail.com',
            yearofbirth: 1795
        },
        {
            firstName: 'Jack',
            lastName: 'Daniels',
            email: 'jackdaniels@gmail.com',
            yearofbirth: 1866
        },
    ]

};