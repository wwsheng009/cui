import React, { useMemo } from 'react'
import { Avatar, Tooltip } from 'antd'
import { UserTeam, UserProfile } from '@/openapi/user/types'
import { App } from '@/types'
import UserAvatar from '@/widgets/UserAvatar'
import styles from './index.less'

export interface TeamCardProps {
	team: UserTeam
	selected: boolean
	roleLabel: string
	ownerLabel: string
	onClick: () => void
	/** User profile for personal account avatar */
	userProfile?: UserProfile | null
}

const TeamCard: React.FC<TeamCardProps> = ({ team, selected, roleLabel, ownerLabel, onClick, userProfile }) => {
	// Convert UserProfile to App.User format for UserAvatar component
	const personalUser = useMemo<App.User | null>(() => {
		if (!userProfile || team.team_id !== 'personal') return null
		return {
			id: userProfile['yao:user_id'] || userProfile.sub || '',
			name: userProfile.name || '',
			avatar: userProfile.picture || '',
			type: 'user'
		}
	}, [userProfile, team.team_id])

	return (
		<Tooltip
			title={team.description || null}
			placement='top'
			mouseEnterDelay={0.3}
			overlayStyle={{ maxWidth: '400px' }}
		>
			<div className={`${styles.teamCard} ${selected ? styles.teamCardSelected : ''}`} onClick={onClick}>
				{/* Avatar/Logo */}
				<div className={styles.teamLogoWrapper}>
					{team.team_id === 'personal' && personalUser ? (
						<UserAvatar user={personalUser} size={40} showCard={false} forcePersonal={true} />
					) : (
						<Avatar size={40} src={team.logo} className={styles.teamLogo}>
							{!team.logo && (team.display_name || team.name)[0].toUpperCase()}
						</Avatar>
					)}
				</div>

				{/* Team Info */}
				<div className={styles.teamInfo}>
					<div className={styles.teamHeader}>
						<h3 className={styles.teamName}>{team.display_name || team.name}</h3>
						{team.is_owner && team.team_id !== 'personal' && (
							<span className={styles.ownerBadge}>{ownerLabel}</span>
						)}
					</div>
					{team.description && <p className={styles.teamDescription}>{team.description}</p>}
				</div>

				{/* Role - Don't show for personal workspace */}
				{team.team_id !== 'personal' && roleLabel && <div className={styles.teamRole}>{roleLabel}</div>}
			</div>
		</Tooltip>
	)
}

export default TeamCard
