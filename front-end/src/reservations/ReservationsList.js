import React from 'react';
import Reservation from './Reservation';


function ReservationList({ reservations }) {
    const currentReservations = reservations.filter((reservation) => reservation.status !== 'finished');
    const tableRows = currentReservations.map((reservation) => {
        return (
            
            <Reservation
                key={reservation.reservation_id}
                reservation={reservation}
            />
        );
    });
    
    if (reservations.length) {
        return (
            <div className="container-fluid" style={{ padding: "0" }}>
                <div className='row no-gutters'>
                    <div className="col">
                        <table className="table" style={{ padding: "0", alignItems: "center", justifyContent: "center" }}>
                            <thead className="table-head" style={{opacity: "70%" }}>
                                <tr style={{ padding: "0", marginLeft: "0", marginRight: "0"}}>
                                    <th scope="col" style={{ padding: "0", marginLeft: "0", marginRight: "0"}}>Guest</th>

                                    <th scope="col" style={{ padding: "0", marginLeft: "0", marginRight: "0"}}>Date &amp; Time</th>

                                    <th scope="col" style={{ padding: "0", marginLeft: "0", marginRight: "0"}}>Status</th>
                                    <th className="text-center" scope="col" style={{ padding: "0", marginLeft: "0", marginRight: "0"}}>
                                        Table Seating
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ opacity: "80%", color: "black" }}>{tableRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } else {
        return <div style={{ color: "black", fontSize: "20px" }}>No reservations found.</div>;
    }
}

export default ReservationList;