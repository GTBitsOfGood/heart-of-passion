import { Box, Flex, VStack } from "@chakra-ui/react";
import { ExpenseObject, ExpenseType } from "~/common/types"

type PropT = {
    expenses?: ExpenseObject[];
};

function OneExpense({ exp }: { exp: ExpenseObject }) {
    return <Flex justify="space-between">
        <Box>{exp.name}</Box>
        <Box>${exp.numberOfUnits ?? 0}</Box>
    </Flex>
}

export default function ExpensesList({ expenses }: PropT) {
    return <VStack>
        {expenses?.map(e =>
            <OneExpense key={e.name + e.costType + e.type} exp={e} />  
        ) ?? ""}
    </VStack>
}