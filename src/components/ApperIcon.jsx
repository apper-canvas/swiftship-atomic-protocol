import * as Icons from 'lucide-react';

const ApperIcon = ({ name, className = "h-4 w-4", ...props }) => {
    let IconComponent = Icons[name];
    if (!IconComponent) {
        console.warn(`Icon "${name}" does not exist in lucide-react`);
        IconComponent = Icons['Smile'];
    }
    return <IconComponent className={className} {...props} />;
};
export default ApperIcon;