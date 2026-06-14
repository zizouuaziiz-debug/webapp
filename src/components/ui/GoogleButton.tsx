import { GoogleLogin } from "@react-oauth/google";
import { useLang } from "@/context/LanguageContext";

interface GoogleButtonProps {
  onSuccess: (credential: string) => void;
  disabled?: boolean;
}

export function GoogleButton({ onSuccess, disabled }: GoogleButtonProps) {
  const { t } = useLang();

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess(credentialResponse.credential);
          }
        }}
        onError={() => console.error("Google login failed")}
        text="continue_with"
        shape="rectangular"
        theme="outline"
        width="100%"
        size="large"
        locale={undefined}
      />
    </div>
  );
}
