import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import "./Leaderboard.css"
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  let data = React.useMemo(() => leaders, [leaders]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "High score",
        accessor: "highScore",
      }
    ],
    []
  );

  const getLeaders = async () => {
    try {
        let res = await axios.get(`http://localhost:5000/api/game/leaderboard`);
        // let res = await axios.get(`https://memory-game-backend-8zmy.onrender.com/api/game/leaderboard`, { withCredentials: true });
        if(res?.data && res?.data.leaders) {
            setLeaders(res.data.leaders)
        }
    } catch (err) {
        console.log(err);
    }
  };
  useEffect(() => { getLeaders() }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <>
    <div style={{ display: "flex", marginBottom: "25px" }}> 
    <span style={{ flexGrow: "1", textAlign: "left",  }}> <Link to="/"> <button> Home </button> </Link> </span> 
      <span style={{ flexGrow: "2", textAlign: "left", fontSize: "30px" }}> Leaderboard </span>  
    </div> 
    <div className="Leaderboard">
      <div className="container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Leaderboard;