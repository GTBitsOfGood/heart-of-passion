import { Input, Radio, RadioGroup, Select, Textarea, VStack } from "@chakra-ui/react";
import { ExpenseObject, ExpenseType } from "~/common/types/types"

type PropT = {
    expense?: ExpenseObject;
};

const expenseOptions = Object.keys(ExpenseType) as Array<keyof typeof ExpenseType>;

export default function ExpenseEditor({ expense }: PropT) {
    return <>
        Name of Expense
        <Input />
        Expense Type
        <Select>
            {expenseOptions.map((o, index) =>
                <option value={o} key={index}>{o}</option>
            )}
        </Select>
        Cost in USD
        <Input />
        Per unit or flat cost?
        <RadioGroup>
            <VStack>
                <Radio>Per unit</Radio>
                <Radio>Flat cost</Radio>
            </VStack>
        </RadioGroup>
        Number of units
        <Input />
        Notes
        <Textarea />
    </>
}