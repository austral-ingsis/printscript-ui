import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemText, TextField,
  Typography
} from "@mui/material";
import {useGetFormatRules, useModifyFormatRules} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";
import { FormatRule } from '../../types/Rule.ts';

const FormattingRulesList = () => {
  const [rules, setRules] = useState<FormatRule[] | undefined>([]);

  const {data, isLoading} = useGetFormatRules();
  const {mutateAsync, isLoading: isLoadingMutate} = useModifyFormatRules({
    onSuccess: () => queryClient.invalidateQueries('formatRules')
  })

  useEffect(() => {
    setRules(data)
  }, [data]);

  const handleValueChange = (rule: FormatRule, newValue: string | number) => {
    const newRules = rules?.map(r => {
      if (r.type === rule.type) {
        return {...r, value: newValue}
      } else {
        return r;
      }
    })
    setRules(newRules)
  };

  const handleNumberChange = (rule: FormatRule) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    handleValueChange(rule, isNaN(value) ? 0 : value);
  };

  const toggleRule = (rule: FormatRule) => () => {
    const newRules = rules?.map(r => {
      if (r.type === rule.type) {
        return {...r, allowed: !r.allowed}
      } else {
        return r;
      }
    })
    setRules(newRules)
  }

  return (
    <Card style={{padding: 16, margin: 16}}>
      <Typography variant={"h6"}>Formatting rules</Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
          isLoading || isLoadingMutate ?  <Typography style={{height: 80}}>Loading...</Typography> :
          rules?.map((rule) => {
          return (
            <ListItem
              key={rule.type}
              disablePadding
              style={{height: 40}}
            >
              <Checkbox
                edge="start"
                checked={rule.allowed}
                disableRipple
                onChange={toggleRule(rule)}
              />
              <ListItemText primary={rule.type} />
              {typeof rule.maxInt === 'number' ?
                (<TextField
                  type="number"
                  variant={"standard"}
                  value={rule.maxInt}
                  onChange={handleNumberChange(rule)}
                />) 
                // : typeof rule.value === 'string' ?
                //   (<TextField
                //     variant={"standard"}
                //     value={rule.value}
                //     onChange={e => handleValueChange(rule, e.target.value)}
                //   />) 
                : null
              }
            </ListItem>
          )
        })}
      </List>
      <Button disabled={isLoading} variant={"contained"} onClick={() => mutateAsync(rules ?? [])}>Save</Button>
    </Card>

  );
};

export default FormattingRulesList;