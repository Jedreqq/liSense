
import { useEffect, useState } from 'react';
import classes from './Branches.module.css';

const Branches = props => {
    const [branchesInfo, setBranchesInfo] = useState({
        branches: [],
    });

    useEffect(() => {
        fetch('http://localhost:3001/ownerBranches', {
            headers: {
                Authorization: 'Bearer ' + props.loginStatus.token
            }
        }).then(res => {
            if(res.status !== 200) {
                throw new Error('Failed to fetch branches.');
            }
            return res.json();
        }).then(resData => {
            console.log('test test');
            console.log(resData);
            setBranchesInfo((branchesInfo) => ({
                ...branchesInfo,
                branches: resData.branches.map(branch => {
                    return {
                        ...branch
                    }
                })
            }))
        }).catch(err => console.log(err)); 
    }, [props.loginStatus.token])
    return <div>{branchesInfo.branches.length === 0 && <p>No branches found.</p>}</div>
}

export default Branches;