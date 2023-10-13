import * as React from "react";
import Layout from "@/components/layout/secondary";
import { Card, Button, Input, Divider } from "@nextui-org/react";
import Logo from "@/components/logo";
import Image from "next/image";
import { pacifico } from "@/components/layout/main";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import supabase from "@/lib/supabase";
import type { OAuthResponse, Provider } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { Context } from "../_app";

type formStateType = {
  email: string;
  password: string;
};

const Login = () => {
  const [formState, setFormState] = React.useState<formStateType>({
    email: "",
    password: "",
  });

  const { state, setState } = React.useContext(Context);

  const router = useRouter();

  React.useEffect(() => {
    if (state.authenticated) {
      router.replace("/home");
    }
  });

  const login = async (provider: Provider) => {
    try {
      const oAuthRes: OAuthResponse = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + "/home",
          scopes: "repo gist notifications",
        },
      });

      if (oAuthRes.error) {
        console.log(oAuthRes.error);
      } else if (oAuthRes.data) {
        console.log(oAuthRes.data);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("token", JSON.stringify(true));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formState);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((val) => ({ ...val, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-row h-screen w-screen">
      <Card
        className="h-full flex-[0.3.5] hidden flex-col items-center justify-start md:flex"
        radius="none"
      >
        <div className="h-16 w-full p-4">
          <Logo />
        </div>
        <div className="h-96 w-96 mt-auto mb-auto relative">
          <Image src={"/images/login.svg"} alt="login" fill />
        </div>
        <div className="flex flex-col gap-4 items-start justify-start h-36 w-full px-4">
          <span className={`${pacifico.className} text-4xl`}>TrEdit</span>
          <span>
            A collaborative way of editing text with Ably realtime service
          </span>
          <span className="font-bold">CodeDecoders © 2023</span>
        </div>
      </Card>
      <div className="flex-1 h-full flex justify-center items-center">
        <form
          className="flex flex-col p-4 h-[70%] w-[30%] min-w-[400px] gap-8 items-center"
          onSubmit={submit}
        >
          <span className="text-5xl pb-28">
            Get started with{" "}
            <span className={`font-bold ${pacifico.className} text-6xl`}>
              TrEdit
            </span>
          </span>
          <Input
            label="Email"
            name={"email"}
            value={formState.email}
            onChange={onChange}
          />
          <Input
            label="Password"
            name={"password"}
            type={showPassword ? "text" : "password"}
            value={formState.password}
            onChange={onChange}
            endContent={
              showPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setShowPassword(false)}
                  size={20}
                  className="cursor-pointer"
                />
              ) : (
                <AiOutlineEye
                  onClick={() => setShowPassword(true)}
                  size={20}
                  className="cursor-pointer"
                />
              )
            }
          />
          <Button type={"submit"} fullWidth>
            Login
          </Button>
          <Divider dir="horizontal" />
          <Button
            onClick={() => login("github")}
            fullWidth={false}
            className={
              "flex flex-row justify-space-between h-16 w-52 text-md gap-4"
            }
            startContent={
              <Image
                src={"/images/github-mark.svg"}
                alt="google"
                height={30}
                width={30}
              />
            }
          >
            Sign in with GitHub
          </Button>
        </form>
      </div>
    </div>
  );
};

Login.getLayout = (page: React.ReactElement) => {
  return <Layout title="Login">{page}</Layout>;
};

export default Login;
