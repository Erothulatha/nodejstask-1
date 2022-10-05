const express = require('express')
const Connection = require("./model/connection")
const app = express()

//TESTING API
app.get('/', (req, res) => {
    res.send("Welcome")
})

//MIDDLEWARE
app.use(express.json())

//CREATE CLINIC TABLE
app.get("/createclinic", (req, res) => {

    let sql = "create table project1.clinic1(clinicid int primary key ,C_Name varchar(255), C_location varchar(255))";

    Connection.query(sql, (err) => {

        if (err) {

            throw err;

        }

        res.send(" table created");

    });

});

//CREATE NURSES TABLE
app.get("/createnurses", (req, res) => {

    let sql = "create table project1.nurses2(nurseid int primary key ,firstname varchar(255), lastname varchar(255))";
    Connection.query(sql, (err) => {

        if (err) {

            throw err;

        }

        res.send(" table created");

    });

});

//CREATE SHIFT TABLE
app.get("/createshift", (req, res) => {

    let sql = "create table project1.shift2(shiftid int primary key,clinicid int,Stime time ,Etime time,Sname varchar(255))";
    Connection.query(sql, (err) => {

        if (err) {

            throw err;

        }

        res.send(" table created");

    });

});


//CREATE SHEDULE TABLE
app.get("/createshedule", (req, res) => {

    let sql = "create table project1.shedule(sheduleid int primary key,nurseid int,clinicid int,shiftid int,S_date date)";
    Connection.query(sql, (err) => {

        if (err) {

            throw err;

        }

        res.send(" table created");

    });

});


//CREATE LEAVES TABLE
app.get("/createleaves", (req, res) => {

    let sql = "create table  project1.leaves1(leavesid int ,nurseid int,Sdate date,Edate date,status varchar(255),A_by varchar(255))";
    Connection.query(sql, (err) => {

        if (err) {

            throw err;

        }

        res.send(" table created");

    });

});


//INSERT DATA INTO NURSE TABLE
app.post('/adddata', (req, res) => {
    const { nurseid, firstname, lastname } = req.body
    try {

        let sql = "insert into project1.nurses2(nurseid,firstname,lastname)values(?,?,?)";
        Connection.query(sql, [nurseid, firstname, lastname], (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send("already user inseted")
            }
            return res.status(201).json({ message: "new user sucessfully created!" });
        }
        )

    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});

//INSERT DATA INTO CLINIC TABLE
app.post('/addclinic', (req, res) => {
    const { clinicid, C_Name, C_location, status } = req.body
    try {

        let sql = "insert into project1.clinic1(clinicid,C_Name,C_location,status) values(?,?,?,?);";
        Connection.query(sql, [clinicid, C_Name, C_location, status], (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send("already user inseted ")
            }
            return res.status(201).json({ message: "new user sucessfully created!" });
        }
        )

    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});


//INSERT INTO LEAVES TABLE
app.post('/addleaves', (req, res) => {
    const { leavesid, nurseid, Sdate, Edate, status, A_by } = req.body
    try {

        let sql = "insert into project1.leaves1(leavesid ,nurseid ,Sdate,Edate,status ,A_by )values(?,?,?,?,?,?)";

        Connection.query(sql, [leavesid, nurseid, Sdate, Edate, status, A_by], (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send("already user inseted ")
            }
            return res.status(201).json({ message: "new user sucessfully created!" });
        }
        )

    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});


//INSERT DATA INTO SHIFT TABLE
app.post('/addshift', (req, res) => {
    const { shiftid, clinicid, Stime, Etime, Sname } = req.body
    try {

        let sql = "INSERT INTO project1.shift2( shiftid,clinicid,Stime,Etime,Sname  ) VALUES (?,?,?,?,?)";
        Connection.query(sql, [shiftid, clinicid, Stime, Etime, Sname], (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send("already user inseted ")
            }
            return res.status(201).json({ message: "new user sucessfully created!" });
        }
        )

    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});


//INSERT NURSE DATA INTO SHEDULE TABLE
app.post('/addnursedata', (req, res) => {
    const { nurseid, clinicid, shiftid, S_date } = req.body
    try {

        let sql = "INSERT INTO project1.shedule2( nurseid,clinicid,shiftid,S_date ) VALUES (?,?,?,?)";
        Connection.query(sql, [nurseid, clinicid, shiftid, S_date], (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send("already user inseted")
            }
            return res.status(201).json({ message: "new user sucessfully created!" });
        }
        )

    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});




//JOIN QUERY 
app.post('/getnurse', (req, res) => {
    const { S_date, E_date } = req.body
    let status = req.body.status === "activated" ? true : false
    try {

        let sql = `
        select project1.shedule2.nurseid ,project1.nurses2.firstname,project1.nurses2.lastname,project1.clinic1.clinicid,project1.clinic1.status,
         project1.clinic1.C_name, project1.shift2.shiftid ,project1.shift2.Sname,project1.shift2.stime ,project1.shift2.Etime ,
         project1.shedule2.S_date from project1.shedule2 
          join project1.nurses2 on project1.shedule2.nurseid=project1.nurses2.nurseid  
           join project1.clinic1 on project1.shedule2.clinicid=project1.clinic1.clinicid 
            join project1.shift2 on project1.shedule2.shiftid=project1.shift2.shiftid 
             where project1.shedule2.S_date between ? and ? and status=? `;

        Connection.query(sql, [S_date, E_date, status], (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send()
            }
            return res.status(201).json({ message: rows })
        })

    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});


app.post('/addleavesdata2', (req, res) => {
    const { nurseData } = req.body;
    console.log("nurseData", req.body)
    try {
        let queryString = `
        select * from project1.leaves2
        where nurseid=${req.body.nurseid}
        and Sdate <= '${req.body.date}' and Edate >= '${req.body.date}'`;
        Connection.query(queryString, (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send()
            } else {
                if (rows && rows.length > 0 && rows[0].status == 'approved' ) {
                    console.log("rowsdate",rows);
                    return res.status(201).json({ message: rows });

                }
                else {

                    let insertQuery = `
                        insert into project1.shedule2 (nurseid, clinicid, shiftid, S_date) 
                        select nurseid, clinicid, shiftid, '${req.body.date}'
                        from project1.shedule2 where  nurseid=${req.body.nurseid} 
                        and not exists(select S_date from project1.Shedule2
                        where nurseid=${req.body.nurseid} and S_date='${req.body.date}')`;

                    Connection.query(insertQuery, (err, rows, fields) => {
                        if (err) {
                            console.log("Error while inserting a user into the database", err)
                            return res.status(400).send()
                        }
                        return res.status(201).json({ message: rows });
                    })
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});


//ADD NURSE DATA INTO SHEDULE TABLE
app.post('/addnurse', (req, res) => {
    const { nurseData } = req.body;
    console.log("nurseData", req.body)
    try {
        let queryString = `
        select * from project1.leaves2
        where nurseid=${req.body.nurseid}
        and Sdate <= '${req.body.date}' and Edate >= '${req.body.date}'`;
        Connection.query(queryString, (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send()
            } else {
                if (rows && rows.length > 0 && rows[0].status == 'approved') {
                    console.log("rowsdate", rows);
                    return res.status(201).json({ message: rows });

                }
                else {

                    let insertQuery = `
                        insert into project1.shedule2 (nurseid,clinicid,shiftid,S_date) 
                        select ${req.body.nurseid},${req.body.clinicid},${req.body.shiftid} ,'${req.body.date}'
                        where not exists(select nurseid,S_date from project1.Shedule2
                        where nurseid=${req.body.nurseid} and S_date='${req.body.date}')`;

                    Connection.query(insertQuery, (err, rows, fields) => {
                        if (err) {
                            console.log("Error while inserting a user into the database", err)
                            return res.status(400).send()
                        }
                        return res.status(201).json({ message: rows });
                    })
                }
            }
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});

//ADD LEAVES DATA INTO LEAVES TABLE
app.post('/addleavesdata', (req, res) => {
    const { nurseData } = req.body;
    console.log("nurseData", req.body)
    try {
        let queryString =
            `SELECT
           Sdate ,
           COUNT(Sdate) AS no_of_rows 
          FROM project1.leaves2
          where Sdate='${req.body.Sdate}'; `

        Connection.query(queryString, (err, rows, fields) => {
            if (err) {
                console.log("Error while inserting a user into the database", err)
                return res.status(400).send()
            } else {
                console.log(rows[0].no_of_rows);
                if (rows.length > 0 && rows[0].no_of_rows >= 3) {
                    return res.status(201).send("rejected");
                }
                else {
                    let insertQuery = `
                    insert into project1.leaves2 (leavesid,nurseid,Sdate,Edate,status,A_by)
                    select * from (select ${req.body.leavesid} as leavesid,${req.body.nurseid} as nurseid,'${req.body.Sdate}' 
                    as Sdate,'${req.body.Edate}' as Edate ,'${req.body.status}' as status ,'${req.body.A_by}' as A_by) as tmp
                    where not exists 
                    (select nurseid,Sdate from project1.leaves2 where nurseid=${req.body.nurseid} and Sdate='${req.body.Sdate}') limit 1`;


                    Connection.query(insertQuery, (err, rows, fields) => {
                        if (err) {
                            console.log("Error while inserting a user into the database", err)
                            return res.status(400).send()
                        }
                        return res.status(201).json({ message: rows });
                    })
                }
            }
        }
        )
    }
    catch (err) {
        console.log(err);
        return res.status(500).send()
    }
});





//SERVER CONNECTION
app.listen(7000, () => {
    console.log("server running")
})