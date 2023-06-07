import React, { useState, useEffect } from 'react'
import { Card,CardHeader,CardContent,Typography} from "@mui/material"; 

function DashboardCard(props){
    return(
    
        <div>
            <Card  elevation={1}>
                <CardHeader title={props.title}/>
                <CardContent>
                    <Typography  id={props.id}  variant="h5" color="textSecondary">
                        {props.count}
                        {props.icon}
                    </Typography>
                </CardContent>
            </Card>
           
        </div>
    );
}
export default DashboardCard