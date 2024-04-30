/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Api, GitHub, Try } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { usePageEffect } from "../../core/page.js";
import {Link} from "../../common/Link.js";

export function Component(): JSX.Element {
  usePageEffect({ title: "React App" });

  return (
    <Container sx={{ py: "10vh" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Welcome to the edge!
      </Typography>

      <Typography sx={{ mb: 4 }} variant="h3" align="center">
        Use advanced AI services without internet connection<sup>1</sup>, in your local language<sup>2</sup>
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gridGap: "1rem",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          href={`/simulator`}
          children="Try the simulator"
          startIcon={<Try />}
        />
      </Box>

      <Typography sx={{ mb: 4 }} variant="h5" align="center" marginTop={1}>
        OR dial <a href={'tel:*920*223#'}>*920*223#</a> on all networks in Ghana.
      </Typography>

      <Typography sx={{ mb: 2 }} variant="h6" align="center" marginTop={20}>
        <sup>1</sup>Please note that on this website, you actually need an internet connection despite its optimization for edge connections. The statement "Use advanced AI services without internet connection" refers to the USSD service, not the website itself.<br></br>
        <sup>2</sup>Not all local languages are supported. Only major ones are provided.
      </Typography>
      <Typography sx={{ mb: 2 }} variant="h6" align="center">
        <Link href={'#'}>Learn more about this research preview</Link>
      </Typography>
    </Container>
  );
}

Component.displayName = "Dashboard";
