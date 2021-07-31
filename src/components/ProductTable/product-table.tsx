import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import {createStyles, withStyles, WithStyles, Theme} from '@material-ui/core/styles';
import {
  Column,
  FilteringState, GroupingState,
  IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSorting,
  PagingState, SortingState, DataTypeProvider, DataTypeProviderProps, SearchState,
} from '@devexpress/dx-react-grid';
import {
  DragDropProvider, Grid, GroupingPanel, PagingPanel,
  Table, TableFilterRow, TableGroupRow,
  TableHeaderRow, Toolbar, SearchPanel
} from '@devexpress/dx-react-grid-material-ui';
import {useEffect} from "react";
import {getAllProduct} from "../../services/product.service";
import {IProduct} from "../../interfaces/product.interface";

type CurrencyFormatterProps = DataTypeProvider.ValueFormatterProps & WithStyles;
type CurrencyEditorProps = DataTypeProvider.ValueEditorProps & WithStyles;

const ProductTable = () => {

  const [columns] = React.useState<Column[]>([
    {name: 'productId', title: 'เลขสินค้า'},
    {name: 'productName', title: 'ชื่อสินค้า'},
    {name: 'productPrice', title: 'ราคา (บาท)'},
    {name: 'amount', title: 'จำนวน (หน่วย)'},
    {name: 'discount', title: 'ส่วนลด (บาท)'},
    {name: 'total', title: 'เป็นทั้งสิ้น (บาท)'},
    {name: 'buyDate', title: 'วันที่ซื้อ'},
    {name: 'billId', title: 'เลขบิล'},
  ]);
  const [rows, setRows] = React.useState<IProduct[]>([]);
  const [pageSizes] = React.useState<number[]>([10,15,20,25,30]);
  const [currencyColumns] = React.useState<string[]>(['productPrice', 'discount', 'total']);
  const [numberColumns] = React.useState<string[]>(['amount']);

  useEffect(() => {
    async function fetchData() {
      let response = await getAllProduct();
      setRows(response.data)
    }

    fetchData();
  }, []);


  const availableFilterOperations: string[] = [
    'equal', 'notEqual',
    'greaterThan', 'greaterThanOrEqual',
    'lessThan', 'lessThanOrEqual',
  ];

  const styles = ({typography}: Theme) => createStyles({
    currency: {
      fontWeight: typography.fontWeightMedium,
    },
    numericInput: {
      fontSize: '14px',
      width: '100%',
    },
  });

  const getInputValue = (value?: string): string =>
      (value === undefined ? '' : value);

  const CurrencyEditor = withStyles(styles)(
      ({onValueChange, classes, value}: CurrencyEditorProps) => {
        const handleChange = (event: { target: { value: any; }; }) => {
          const {value: targetValue} = event.target;
          if (targetValue.trim() === '') {
            onValueChange(undefined);
            return;
          }
          onValueChange(parseInt(targetValue, 10));
        };
        return (
            <Input
                type="number"
                classes={{
                  input: classes.numericInput,
                }}
                fullWidth={true}
                value={getInputValue(value)}
                inputProps={{
                  min: 0,
                  placeholder: 'Filter...',
                }}
                onChange={handleChange}
            />
        );
      },
  );

  const CurrencyFormatter = withStyles(styles)(
      ({value, classes}: CurrencyFormatterProps) => (
          <i className={classes.currency}>
            {value.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})}
          </i>
      ));

  const CurrencyTypeProvider: React.ComponentType<DataTypeProviderProps> =
      (props: DataTypeProviderProps) => (
          <DataTypeProvider
              formatterComponent={CurrencyFormatter}
              editorComponent={CurrencyEditor}
              availableFilterOperations={availableFilterOperations}
              {...props}
          />
      );

  const NumberTypeProvider: React.ComponentType<DataTypeProviderProps> =
      (props: DataTypeProviderProps) => (
          <DataTypeProvider
              editorComponent={CurrencyEditor}
              availableFilterOperations={availableFilterOperations}
              {...props}
          />
      );

  return (
      <Paper>
        <Grid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.productId}
        >
          <FilteringState
              defaultFilters={[]}
          />
          <SearchState/>
          <SortingState
              defaultSorting={[
                {columnName: 'buyDate', direction: 'asc'},
              ]}
          />


          <GroupingState/>
          <PagingState/>

          <IntegratedGrouping/>
          <IntegratedFiltering/>
          <IntegratedSorting/>
          <IntegratedPaging/>

          <CurrencyTypeProvider for={currencyColumns}/>
          <NumberTypeProvider for={numberColumns}/>

          <DragDropProvider/>

          <Table />
          <TableHeaderRow showSortingControls={true}/>
          <TableFilterRow showFilterSelector={true}/>
          <PagingPanel pageSizes={pageSizes}/>

          <TableGroupRow/>
          <Toolbar/>
          <SearchPanel/>
          <GroupingPanel showSortingControls={true}/>
        </Grid>
      </Paper>
  );
}

export default ProductTable
