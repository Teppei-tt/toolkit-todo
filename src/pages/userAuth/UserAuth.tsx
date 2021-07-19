import React from "react";
import { RouteComponentProps } from "react-router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { auth } from "../../firebase";
import { useEffect } from "react";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface AuthDataTypes {
  email: string;
  password: string;
}

const UserAuth: React.FC<RouteComponentProps> = (props) => {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthDataTypes>();
  // サインイン画面かサインアップ画面かの切り替えをuseStateで管理
  const [isSignIn, setIsSignIn] = useState(true);

  // ログイン処理
  const handleSignIn = async (data: AuthDataTypes) => {
    const { email, password } = data;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      props.history.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // 新規登録処理
  const handleSignUp = async (data: AuthDataTypes) => {
    const { email, password } = data;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      props.history.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

    // ログインしているユーザーが訪れたとき、強制的にアプリ画面に飛ばす
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        user && props.history.push("/");
      });
    }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignIn ? "ログイン" : "新規登録"}
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={
            isSignIn ? handleSubmit(handleSignIn) : handleSubmit(handleSignUp)
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                // name="email"
                autoComplete="email"
                autoFocus
                error={Boolean(errors.email)}
                helperText={errors.email && errors.email.message}
                {...register("email", {
                  required: true,
                  pattern:
                    /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                // name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password && errors.password.message}
                {...register("password", { required: true, minLength: 6 })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignIn ? "ログインする" : "新規登録する"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn
                  ? "アカウントをお持ちでない方はこちら"
                  : "アカウントをお持ちの方はこちら"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default UserAuth;
