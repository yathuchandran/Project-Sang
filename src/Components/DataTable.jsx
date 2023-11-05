import DataTable from "react-data-table-component";
import PropTypes from 'prop-types';
import './dt.css';

DataTable.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
};

function CustomDataTable(props) {
    return (
        <DataTable
            style={{ zIndex: '-1' }}
            columns={props.columns}
            data={props.data}
            fixedHeader
            highlightOnHover
            pagination
            customStyles={{
                header: {
                    style: {
                        background: 'red',
                        color: 'blue'
                    }
                }
            }}
        />
    );
}

export default CustomDataTable;
