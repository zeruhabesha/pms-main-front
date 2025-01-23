import React from 'react';
import { CPagination, CPaginationItem } from '@coreui/react';

const UserTablePagination = ({
    currentPage,
    itemsPerPage,
    filteredUsers,
    handlePageChange,
    totalPages
}) => {

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <CPaginationItem
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </CPaginationItem>
                );
            }
            return items;
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <CPaginationItem
                    key={1}
                    active={1 === currentPage}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </CPaginationItem>
            );
            if (startPage > 2) {
                items.push(
                    <CPaginationItem key="start-ellipsis" disabled>
                        ...
                    </CPaginationItem>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <CPaginationItem
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </CPaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <CPaginationItem key="end-ellipsis" disabled>
                        ...
                    </CPaginationItem>
                );
            }
            items.push(
                <CPaginationItem
                    key={totalPages}
                    active={totalPages === currentPage}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </CPaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="pagination-container d-flex justify-content-between align-items-center mt-3">
            <span>Total Users: {filteredUsers.length}</span>
            <CPagination className="d-inline-flex">
                <CPaginationItem
                    aria-label="Previous"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    «
                </CPaginationItem>
                <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    ‹
                </CPaginationItem>
                {renderPaginationItems()}
                <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    ›
                </CPaginationItem>
                <CPaginationItem
                    aria-label="Next"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    »
                </CPaginationItem>
            </CPagination>
        </div>
    );
};

export default UserTablePagination;