import { useDispatch, useSelector } from "react-redux";
import { selectCurrentRole, setRole } from "../features/role/roleSlice";

const roleCopy = {
  admin: "Can add, edit, delete, and restore records.",
  viewer: "Can explore data but cannot change it.",
};

const RoleSwitcher = () => {
  const dispatch = useDispatch();
  const currentRole = useSelector(selectCurrentRole);

  return (
    <div className="panel flex w-full min-w-0 items-center justify-between gap-4 px-4 py-3 sm:w-[540px]">
      <div className="hidden min-w-0 flex-1 sm:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Role
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {roleCopy[currentRole]}
        </p>
      </div>

      <select
        value={currentRole}
        onChange={(event) => dispatch(setRole(event.target.value))}
        className="select w-full sm:w-[290px]"
        aria-label="Switch role"
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
};

export default RoleSwitcher;
