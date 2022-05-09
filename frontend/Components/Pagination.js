import React from 'react';

const Pagination = () => {
    return (
        <>
            <nav className='paginationNav'>
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                        <li key class="page-item"><a class="page-link"></a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
            </nav>
        </>
    );
}

export default Pagination;