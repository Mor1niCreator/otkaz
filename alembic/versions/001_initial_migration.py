"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.String(length=255), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('locale', sa.String(length=5), nullable=False),
        sa.Column('timezone', sa.String(length=50), nullable=False),
        sa.Column('reminder_time', sa.String(length=5), nullable=True),
        sa.Column('ref_code', sa.String(length=8), nullable=False),
        sa.Column('referred_by', sa.String(length=8), nullable=True),
        sa.Column('total_points', sa.Integer(), nullable=True),
        sa.Column('current_rank', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_ref_code'), 'users', ['ref_code'], unique=True)
    op.create_index(op.f('ix_users_session_id'), 'users', ['session_id'], unique=True)

    # Create entries table
    op.create_table('entries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('unit_price', sa.Float(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('fx_rate_to_usd', sa.Float(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('entry_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_entries_id'), 'entries', ['id'], unique=False)
    op.create_index('idx_user_date', 'entries', ['user_id', 'entry_date'], unique=False)
    op.create_index('idx_user_category', 'entries', ['user_id', 'category'], unique=False)

    # Create goals table
    op.create_table('goals',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('target_amount_usd', sa.Float(), nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('is_achieved', sa.Boolean(), nullable=True),
        sa.Column('achieved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_goals_id'), 'goals', ['id'], unique=False)

    # Create presets table
    op.create_table('presets',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('unit_price', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_presets_id'), 'presets', ['id'], unique=False)

    # Create user_achievements table
    op.create_table('user_achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('achievement_key', sa.String(length=50), nullable=False),
        sa.Column('achieved_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_achievements_id'), 'user_achievements', ['id'], unique=False)
    op.create_index('idx_user_achievement', 'user_achievements', ['user_id', 'achievement_key'], unique=True)

    # Create referral_events table
    op.create_table('referral_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('points_awarded', sa.Integer(), nullable=False),
        sa.Column('referred_user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_referral_events_id'), 'referral_events', ['id'], unique=False)

    # Create fx_rates table
    op.create_table('fx_rates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('rate_to_usd', sa.Float(), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('cached_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fx_rates_id'), 'fx_rates', ['id'], unique=False)
    op.create_index('idx_currency_provider', 'fx_rates', ['currency', 'provider'], unique=True)

    # Create crypto_data table
    op.create_table('crypto_data',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('coin_id', sa.String(length=50), nullable=False),
        sa.Column('symbol', sa.String(length=10), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('current_price_usd', sa.Float(), nullable=False),
        sa.Column('price_5y_ago_usd', sa.Float(), nullable=True),
        sa.Column('market_cap_rank', sa.Integer(), nullable=True),
        sa.Column('cached_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_crypto_data_id'), 'crypto_data', ['id'], unique=False)
    op.create_index('idx_coin_id', 'crypto_data', ['coin_id'], unique=True)

    # Create audit_logs table
    op.create_table('audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    op.drop_index('idx_coin_id', table_name='crypto_data')
    op.drop_index(op.f('ix_crypto_data_id'), table_name='crypto_data')
    op.drop_table('crypto_data')
    op.drop_index('idx_currency_provider', table_name='fx_rates')
    op.drop_index(op.f('ix_fx_rates_id'), table_name='fx_rates')
    op.drop_table('fx_rates')
    op.drop_index(op.f('ix_referral_events_id'), table_name='referral_events')
    op.drop_table('referral_events')
    op.drop_index('idx_user_achievement', table_name='user_achievements')
    op.drop_index(op.f('ix_user_achievements_id'), table_name='user_achievements')
    op.drop_table('user_achievements')
    op.drop_index(op.f('ix_presets_id'), table_name='presets')
    op.drop_table('presets')
    op.drop_index(op.f('ix_goals_id'), table_name='goals')
    op.drop_table('goals')
    op.drop_index('idx_user_category', table_name='entries')
    op.drop_index('idx_user_date', table_name='entries')
    op.drop_index(op.f('ix_entries_id'), table_name='entries')
    op.drop_table('entries')
    op.drop_index(op.f('ix_users_session_id'), table_name='users')
    op.drop_index(op.f('ix_users_ref_code'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')