/// <reference types="react" />
import * as React from 'lib/react/react';
export default class SiderDemo extends React.Component {
    props: any;
    state: {
        collapsed: boolean;
        rowData: any[];
        searhTxt: string;
        selectTreeKey: string;
        insData: any[];
        selectedRowKeys: any[];
        manlist: any[];
        packjson: {};
    };
    componentDidMount(): void;
    onCollapse: (collapsed: any) => void;
    onSelectMenu: (m: any) => void;
    InputSearh: (value: any) => void;
    onTreeSelected: (m: any) => void;
    onSelectChange: (selectedRowKeys: any, selectedRows: any) => void;
    onClose: (valueq: any) => void;
    render(): JSX.Element;
}
